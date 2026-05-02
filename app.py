"""
SkinAI — Skin Cancer Deep Learning Project
Flask web application entry point.
"""

from flask import Flask, render_template

app = Flask(__name__)

# ── Data passed to the template ──────────────────────────────────────────────

CLASS_DISTRIBUTION = {
    "labels": [
        "Melanocytic Nevi (NV)",
        "Melanoma (MEL)",
        "Benign Keratosis (BKL)",
        "Basal Cell Carcinoma (BCC)",
        "Actinic Keratoses (AKIEC)",
        "Vascular Lesions (VASC)",
        "Dermatofibroma (DF)",
    ],
    "counts": [6705, 1113, 1099, 514, 327, 142, 115],
    "colors": [
        "rgba(16,185,129,0.85)",
        "rgba(239,68,68,0.85)",
        "rgba(59,130,246,0.85)",
        "rgba(245,158,11,0.85)",
        "rgba(139,92,246,0.85)",
        "rgba(236,72,153,0.85)",
        "rgba(6,182,212,0.85)",
    ],
    "border_colors": [
        "#10b981", "#ef4444", "#3b82f6",
        "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4",
    ],
}

PER_CLASS_ACCURACY = {
    "labels": [
        "NV (Nevi)", "MEL (Melanoma)", "BKL (Keratosis)",
        "BCC (Carcinoma)", "AKIEC (Actinic)", "VASC (Vascular)", "DF (Fibroma)",
    ],
    "efficientnet": [95, 87, 83, 81, 76, 72, 69],
    "unet_efficientnet": [96, 91, 87, 85, 80, 76, 74],
}

METRICS = [
    {"value": 91,   "label": "Classification Accuracy", "model": "EfficientNet-B4",  "display": "91%",  "sub": "Accuracy", "fill_class": ""},
    {"value": 88,   "label": "Segmentation IoU",        "model": "U-Net",            "display": "88%",  "sub": "IoU Score", "fill_class": "seg-fill"},
    {"value": 85,   "label": "Melanoma Recall",         "model": "MobileNetV2",      "display": "85%",  "sub": "Recall",   "fill_class": "mel-fill"},
    {"value": 93,   "label": "AUC-ROC Score",           "model": "ViT-B/16",         "display": "0.93", "sub": "AUC-ROC",  "fill_class": "auc-fill"},
]

# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Render the main SkinAI project page."""
    return render_template(
        "index.html",
        class_distribution=CLASS_DISTRIBUTION,
        per_class_accuracy=PER_CLASS_ACCURACY,
        metrics=METRICS,
    )


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
