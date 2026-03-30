import firebase_admin
from firebase_admin import credentials, firestore
import datetime

# 1. SETUP FIREBASE
# IMPORTANTE: Reemplaza 'serviceAccountKey.json' con la ruta a tu llave de Firebase Admin SDK
try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
except Exception as e:
    print(f"Error inicializando Firebase: {e}")
    print("Asegúrate de tener el archivo 'serviceAccountKey.json' en la misma carpeta.")
    exit()

db = firestore.client()

def inject_data():
    print("🚀 Iniciando inyección de datos reales...")
    
    # --- Facciones ---
    factions = [
        {"name": "antares industries", "label": "Antares Industries", "order": 1},
        {"name": "mizar systems", "label": "Mizar Systems", "order": 2},
        {"name": "sol tech", "label": "Sol Tech", "order": 3},
        {"name": "sirius corporation", "label": "Sirius Corp", "order": 4}
    ]
    for f in factions:
        db.collection('factions').document(f['name']).set({
            **f, "createdAt": firestore.SERVER_TIMESTAMP
        })
    print("✅ Facciones inyectadas.")

    # --- Tipos de Nave ---
    ship_types = [
        {"name": "storm", "label": "Storm", "order": 1},
        {"name": "tank", "label": "Tank", "order": 2},
        {"name": "shock", "label": "Shock", "order": 3},
        {"name": "engineer", "label": "Engineer", "order": 4},
        {"name": "sniper", "label": "Sniper", "order": 5},
        {"name": "hybrid", "label": "Hybrid", "order": 6}
    ]
    for st in ship_types:
        db.collection('ship_types').document(st['name']).set({
            **st, "createdAt": firestore.SERVER_TIMESTAMP
        })
    print("✅ Tipos de nave inyectadas.")

    # --- Sistemas ---
    systems = [
        {"name": "Vega", "order": 1, "levelMin": 1, "levelMax": 15},
        {"name": "Antares", "order": 2, "levelMin": 15, "levelMax": 30},
        {"name": "Mizar", "order": 3, "levelMin": 30, "levelMax": 45},
        {"name": "Sol", "order": 4, "levelMin": 45, "levelMax": 60},
        {"name": "Draconis", "order": 5, "levelMin": 60, "levelMax": 75},
        {"name": "Sirius", "order": 6, "levelMin": 75, "levelMax": 99}
    ]
    system_ids = {}
    for s in systems:
        doc_ref = db.collection('systems').add({
            **s, "createdAt": firestore.SERVER_TIMESTAMP
        })[1]
        system_ids[s['name']] = doc_ref.id
    print("✅ Sistemas inyectados.")

    # --- Planetas (Ejemplos) ---
    planets = [
        {"name": "Vénar", "systemName": "Vega", "order": 1, "levelMin": 1, "levelMax": 5, "type": "normal"},
        {"name": "Libeia", "systemName": "Vega", "order": 2, "levelMin": 5, "levelMax": 10, "type": "normal"},
        {"name": "Terachon", "systemName": "Vega", "order": 3, "levelMin": 10, "levelMax": 15, "type": "conquest"},
        {"name": "Coloso", "systemName": "Antares", "order": 1, "levelMin": 15, "levelMax": 20, "type": "normal"}
    ]
    for p in planets:
        sys_id = system_ids.get(p['systemName'])
        if sys_id:
            db.collection('planets').add({
                "name": p['name'],
                "systemId": sys_id,
                "order": p['order'],
                "levelMin": p['levelMin'],
                "levelMax": p['levelMax'],
                "type": p['type'],
                "createdAt": firestore.SERVER_TIMESTAMP
            })
    print("✅ Planetas inyectados.")

    # --- Naves Reales (Ejemplos rápidos) ---
    ships = [
        {
            "name": "Nave de Inicio Vega",
            "faction": "antares industries",
            "type": "storm",
            "level": 1,
            "description": "La primera nave que obtienes en el sistema Vega.",
            "stats": {"hp": 1000, "speed": 250, "attack": 50, "defense": 30},
            "price": 0
        },
        {
            "name": "Storm de Antares",
            "faction": "antares industries",
            "type": "storm",
            "level": 15,
            "description": "Una nave rápida y potente diseñada para Antares.",
            "stats": {"hp": 3500, "speed": 280, "attack": 120, "defense": 70},
            "price": 15000
        }
    ]
    for s in ships:
        db.collection('ships').add({
            **s, "createdAt": firestore.SERVER_TIMESTAMP
        })
    print("✅ Naves inyectadas.")

    print("\n🎉 ¡Inyección completada con éxito!")

if __name__ == "__main__":
    inject_data()
