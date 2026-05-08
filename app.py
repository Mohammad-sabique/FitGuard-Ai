from flask import Flask, jsonify, request, render_template
from db import init_db, get_db
from core import normalize_payload, validate_payload, generate_recommendation, now_iso
import json

app = Flask(__name__)


@app.get("/api/logs")
def api_logs():
    limit = int(request.args.get("limit", 12))
    with get_db() as conn:
        rows = conn.execute(
            "SELECT id, created_at, user_name, risk_level, summary FROM audit_logs ORDER BY id DESC LIMIT ?",
            (limit,),
        ).fetchall()
    return jsonify([dict(r) for r in rows])


@app.post("/api/recommend")
def api_recommend():
    raw = request.get_json(force=True, silent=True) or {}
    p = normalize_payload(raw)
    errors = validate_payload(p)
    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    result = generate_recommendation(p)
    ts = now_iso()

    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO user_profiles (
                created_at, name, age, sex, height_cm, weight_kg, activity_level,
                goal, diet_preference, allergies, blood_pressure, diabetes,
                other_conditions, symptoms_notes, meal_photos, body_photos, reports
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                ts, p["name"], p["age"], p["sex"], p["height_cm"], p["weight_kg"],
                p["activity_level"], p["goal"], p["diet_preference"], p["allergies"],
                p["blood_pressure"], p["diabetes"], p["other_conditions"],
                p["symptoms_notes"], json.dumps(p["meal_photos"]),
                json.dumps(p["body_photos"]), json.dumps(p["reports"]),
            ),
        )
        summary = f"{p['name']} | BMI {result['bmi']} | {result['risk_level'].upper()} | {result['status']}"
        conn.execute(
            """
            INSERT INTO audit_logs (created_at, user_name, risk_level, summary, payload_json)
            VALUES (?, ?, ?, ?, ?)
            """,
            (ts, p["name"], result["risk_level"], summary,
             json.dumps({"profile": p, "result": result}, ensure_ascii=False)),
        )
        conn.commit()

    return jsonify({"ok": True, "timestamp": ts, "profile": p, "result": result})


@app.get("/api/profile-summary")
def api_profile_summary():
    with get_db() as conn:
        last = conn.execute(
            "SELECT name, age, sex, height_cm, weight_kg, activity_level, goal, diet_preference, created_at FROM user_profiles ORDER BY id DESC LIMIT 1"
        ).fetchone()
    if not last:
        return jsonify({"ok": True, "profile": None})
    return jsonify({"ok": True, "profile": dict(last)})


@app.get("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
