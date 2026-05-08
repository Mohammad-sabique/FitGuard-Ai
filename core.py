from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple

ACTIVITY_FACTORS = {
    "sedentary": 1.2,
    "light": 1.375,
    "moderate": 1.55,
    "active": 1.725,
    "very_active": 1.9,
}

GOAL_ADJUSTMENT = {
    "fat_loss": -500,
    "maintenance": 0,
    "muscle_gain": 250,
}

GOAL_LABELS = {
    "fat_loss": "Fat loss",
    "maintenance": "Maintenance",
    "muscle_gain": "Muscle gain",
}

DIET_LABELS = {
    "vegetarian": "Vegetarian",
    "vegan": "Vegan",
    "eggs": "Vegetarian + eggs",
    "meat": "Meat / omnivore",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def clamp(v: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, v))


def parse_csv(raw: str | None) -> List[str]:
    if not raw:
        return []
    return [x.strip() for x in raw.split(",") if x.strip()]


def normalize_payload(data: Dict[str, Any]) -> Dict[str, Any]:
    def f(key: str, default: float = 0.0) -> float:
        try:
            return float(data.get(key, default))
        except (TypeError, ValueError):
            return default

    def i(key: str, default: int = 0) -> int:
        try:
            return int(float(data.get(key, default)))
        except (TypeError, ValueError):
            return default

    return {
        "name": str(data.get("name", "User")).strip() or "User",
        "age": i("age"),
        "sex": str(data.get("sex", "male")).strip().lower(),
        "height_cm": f("height_cm"),
        "weight_kg": f("weight_kg"),
        "activity_level": str(data.get("activity_level", "moderate")).strip().lower(),
        "goal": str(data.get("goal", "maintenance")).strip().lower(),
        "diet_preference": str(data.get("diet_preference", "meat")).strip().lower(),
        "allergies": str(data.get("allergies", "")).strip(),
        "blood_pressure": str(data.get("blood_pressure", "normal")).strip().lower(),
        "diabetes": str(data.get("diabetes", "no")).strip().lower(),
        "other_conditions": str(data.get("other_conditions", "")).strip(),
        "symptoms_notes": str(data.get("symptoms_notes", "")).strip(),
        "meal_photos": parse_csv(data.get("meal_photos", "")),
        "body_photos": parse_csv(data.get("body_photos", "")),
        "reports": parse_csv(data.get("reports", "")),
    }


def validate_payload(p: Dict[str, Any]) -> List[str]:
    errors: List[str] = []
    if not (10 <= p["age"] <= 100):
        errors.append("Age must be between 10 and 100.")
    if not (100 <= p["height_cm"] <= 230):
        errors.append("Height must be between 100 cm and 230 cm.")
    if not (25 <= p["weight_kg"] <= 250):
        errors.append("Weight must be between 25 kg and 250 kg.")
    if p["sex"] not in {"male", "female"}:
        errors.append("Sex must be male or female.")
    if p["activity_level"] not in ACTIVITY_FACTORS:
        errors.append("Invalid activity level.")
    if p["goal"] not in GOAL_ADJUSTMENT:
        errors.append("Invalid fitness goal.")
    if p["diet_preference"] not in DIET_LABELS:
        errors.append("Invalid dietary preference.")
    return errors


def mifflin_st_jeor_bmr(weight_kg: float, height_cm: float, age: int, sex: str) -> Tuple[float, str]:
    base = 10 * weight_kg + 6.25 * height_cm - 5 * age
    if sex == "male":
        return base + 5, "10 × weight + 6.25 × height − 5 × age + 5"
    return base - 161, "10 × weight + 6.25 × height − 5 × age − 161"


def build_meal_plan(goal: str, diet: str) -> List[Dict[str, str]]:
    if diet == "vegan":
        breakfast = "Oats with soy milk, chia, banana"
        lunch = "Rice bowl with tofu, vegetables, seeds"
        dinner = "Roti, dal, mixed vegetables, tofu"
        snack = "Fruit, nuts, hummus"
    elif diet == "vegetarian":
        breakfast = "Oats, curd, fruit, nuts"
        lunch = "Rice, paneer, salad, dal"
        dinner = "Roti, mixed vegetables, curd"
        snack = "Fruit, roasted chana"
    elif diet == "eggs":
        breakfast = "Eggs, toast, fruit, yogurt"
        lunch = "Rice, egg curry, salad"
        dinner = "Roti, dal, vegetables, eggs"
        snack = "Boiled eggs, fruit"
    else:
        breakfast = "Oats, eggs, fruit"
        lunch = "Rice, chicken/fish, vegetables"
        dinner = "Roti/rice, lean protein, salad"
        snack = "Yogurt, nuts, fruit"

    if goal == "fat_loss":
        breakfast = "Higher-protein breakfast with controlled carbs"
        lunch = "Lean protein, salad, smaller carb portion"
        dinner = "Vegetables + protein, lower oil"
        snack = "Fruit, nuts, tea/coffee"
    elif goal == "muscle_gain":
        breakfast = "Carb + protein dense breakfast"
        lunch = "Protein-rich lunch with full carbs"
        dinner = "Protein + carbs + vegetables"
        snack = "Milk/soy milk smoothie, nuts, sandwich"

    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return [
        {"day": d, "breakfast": breakfast, "lunch": lunch, "dinner": dinner, "snack": snack}
        for d in days
    ]


def build_workout_plan(goal: str, bmi: float) -> List[Dict[str, str]]:
    if bmi < 18.5:
        return [
            {"day": "Mon", "focus": "Full body light", "plan": "Bodyweight squats, incline push-ups, rows, core"},
            {"day": "Wed", "focus": "Mobility", "plan": "Walking 20-30 min, stretching, shoulder/hip mobility"},
            {"day": "Fri", "focus": "Full body light", "plan": "Resistance bands, lunges, rows, plank"},
            {"day": "Sun", "focus": "Recovery", "plan": "Walk and mobility"},
        ]

    if goal == "muscle_gain":
        return [
            {"day": "Mon", "focus": "Push", "plan": "Bench press, overhead press, incline press, triceps"},
            {"day": "Tue", "focus": "Pull", "plan": "Rows, pulldowns, face pulls, biceps"},
            {"day": "Wed", "focus": "Legs", "plan": "Squats, Romanian deadlift, lunges, calves"},
            {"day": "Thu", "focus": "Rest", "plan": "Light walk and stretching"},
            {"day": "Fri", "focus": "Upper", "plan": "Compound upper-body lifts, rear delts, arms"},
            {"day": "Sat", "focus": "Lower + core", "plan": "Leg press, hip hinge, core circuit"},
            {"day": "Sun", "focus": "Rest", "plan": "Recovery"},
        ]

    if goal == "fat_loss":
        return [
            {"day": "Mon", "focus": "Full body strength", "plan": "Squat, push-up, row, plank"},
            {"day": "Tue", "focus": "Cardio", "plan": "Brisk walk or cycling 30-40 min"},
            {"day": "Wed", "focus": "Full body strength", "plan": "Deadlift pattern, press, lunges, core"},
            {"day": "Thu", "focus": "Cardio + mobility", "plan": "Intervals and stretching"},
            {"day": "Fri", "focus": "Full body strength", "plan": "Repeat compounds with controlled volume"},
            {"day": "Sat", "focus": "Long walk", "plan": "8k-12k steps or 45-60 min easy cardio"},
            {"day": "Sun", "focus": "Rest", "plan": "Recovery"},
        ]

    return [
        {"day": "Mon", "focus": "Upper", "plan": "Press, row, shoulder, arms"},
        {"day": "Tue", "focus": "Lower", "plan": "Squat, hinge, calves, core"},
        {"day": "Wed", "focus": "Cardio", "plan": "Zone 2 cardio 25-35 min"},
        {"day": "Thu", "focus": "Upper", "plan": "Variant lifts, moderate volume"},
        {"day": "Fri", "focus": "Lower", "plan": "Posterior chain and unilateral work"},
        {"day": "Sat", "focus": "Activity", "plan": "Walk or light conditioning"},
        {"day": "Sun", "focus": "Rest", "plan": "Recovery"},
    ]


def risk_engine(p: Dict[str, Any], bmi: float) -> Tuple[str, List[str]]:
    notes = f"{p['symptoms_notes']} {p['other_conditions']}".lower()
    flags: List[str] = []
    level = "low"

    if bmi < 16:
        flags.append("Severely low BMI detected")
        level = "critical"
    elif bmi < 18.5:
        flags.append("Underweight BMI")
        level = "moderate"
    elif bmi >= 30:
        flags.append("High BMI detected")
        level = "moderate"

    if p["blood_pressure"] in {"high", "elevated", "hypertension"}:
        flags.append("Blood pressure concern")
        level = "high" if level != "critical" else "critical"

    if p["diabetes"] == "yes":
        flags.append("Diabetes flagged")
        level = "high" if level != "critical" else "critical"

    if any(term in notes for term in ["chest pain", "faint", "fainting", "dizzy", "shortness of breath", "uncontrolled"]):
        return "critical", flags + ["Critical symptom detected"]

    if bmi >= 40:
        return "critical", flags + ["Extremely high BMI; medical review required"]

    if not flags:
        flags = ["No major safety flags detected"]
    return level, flags


def explainability(p: Dict[str, Any], bmi: float, bmr: float, tdee: float, calories: float, macro: Dict[str, int], risk: str, flags: List[str]) -> Dict[str, Any]:
    return {
        "inputs_used": {
            "age": p["age"],
            "sex": p["sex"],
            "height_cm": p["height_cm"],
            "weight_kg": p["weight_kg"],
            "activity_level": p["activity_level"],
            "goal": p["goal"],
            "diet_preference": p["diet_preference"],
            "blood_pressure": p["blood_pressure"],
            "diabetes": p["diabetes"],
        },
        "calculations": [
            f"BMI = weight / height² = {p['weight_kg']:.1f} / ({p['height_cm']:.1f}/100)² = {bmi:.1f}",
            f"BMR calculated using Mifflin-St Jeor = {bmr:.0f} kcal/day",
            f"TDEE = BMR × activity factor = {bmr:.0f} × {ACTIVITY_FACTORS[p['activity_level']]} = {tdee:.0f} kcal/day",
            f"Goal adjustment = {GOAL_ADJUSTMENT[p['goal']]:+d} kcal",
            f"Final calorie target = {calories:.0f} kcal/day",
        ],
        "rules_triggered": [
            f"Goal rule: {GOAL_LABELS[p['goal']]}",
            f"Risk rule: {risk.upper()}",
            f"Diet rule: {DIET_LABELS[p['diet_preference']]}",
            "Protein emphasis increased for safety and training support",
        ],
        "safety_flags": flags,
        "macro_target": macro,
        "decision_summary": "Plan generated using physiological formulas + rule-based adjustments.",
    }


def generate_recommendation(p: Dict[str, Any]) -> Dict[str, Any]:
    bmi = p["weight_kg"] / ((p["height_cm"] / 100) ** 2)
    bmr, bmr_formula = mifflin_st_jeor_bmr(p["weight_kg"], p["height_cm"], p["age"], p["sex"])
    tdee = bmr * ACTIVITY_FACTORS[p["activity_level"]]
    calories = clamp(tdee + GOAL_ADJUSTMENT[p["goal"]], 1200 if p["sex"] == "female" else 1400, 3800)
    calories = round(calories / 10) * 10

    risk, flags = risk_engine(p, bmi)

    if risk == "critical":
        macro = {"protein_g": 0, "fat_g": 0, "carbs_g": 0}
        meal_plan = []
        workout_plan = []
        status = "Consult a qualified doctor or dietitian before following any automated plan."
    else:
        if p["goal"] == "muscle_gain":
            protein_per_kg = 1.8
            fat_pct = 0.25
        elif p["goal"] == "fat_loss":
            protein_per_kg = 2.0
            fat_pct = 0.30
        else:
            protein_per_kg = 1.6
            fat_pct = 0.28

        if bmi >= 30:
            protein_per_kg += 0.1
        if p["activity_level"] in {"active", "very_active"}:
            protein_per_kg += 0.1

        protein_g = round(p["weight_kg"] * protein_per_kg)
        fat_g = round((calories * fat_pct) / 9)
        carb_g = round(max(0, (calories - protein_g * 4 - fat_g * 9) / 4))
        macro = {"protein_g": protein_g, "fat_g": fat_g, "carbs_g": carb_g}
        meal_plan = build_meal_plan(p["goal"], p["diet_preference"])
        workout_plan = build_workout_plan(p["goal"], bmi)
        status = "Plan generated successfully."

    explanation = explainability(p, bmi, bmr, tdee, calories, macro, risk, flags)
    return {
        "bmi": round(bmi, 1),
        "bmr": int(round(bmr)),
        "bmr_formula": bmr_formula,
        "tdee": int(round(tdee)),
        "target_calories": int(round(calories)),
        "macro_plan": macro,
        "meal_plan": meal_plan,
        "workout_plan": workout_plan,
        "risk_level": risk,
        "safety_flags": flags,
        "explanation": explanation,
        "status": status,
    }
