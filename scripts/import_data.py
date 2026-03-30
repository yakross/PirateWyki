import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
import os

"""
PirateWyki Data Importer Tool
-----------------------------
Este script de ejemplo demuestra cómo puedes usar Python para subir datos masivos
a tu base de datos de Firestore (PirateWyki) sin tener que usar el panel de administrador uno por uno.

Requisitos:
1. Instalar pip install firebase-admin
2. Descargar tu clave privada de Firebase (service-account-key.json) y colocarla en esta misma carpeta.
"""

def initialize_firebase():
    # Verifica si el archivo de credenciales existe
    cred_path = 'service-account-key.json'
    if not os.path.exists(cred_path):
        print(f"Error: No se encontró el archivo '{cred_path}'.")
        print("Debes ir a la Consola de Firebase -> Configuración del proyecto -> Cuentas de servicio -> Generar nueva clave privada.")
        return None

    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print(f"Error inicializando Firebase: {e}")
        return None

def upload_mock_ships(db):
    print("Iniciando subida de naves de prueba...")
    ships_ref = db.collection('ships')
    
    mock_ships = [
        {
            "name": "Nave de Prueba 1",
            "faction": "antares",
            "type": "storm",
            "techLevel": "45",
            "description": "Subida automáticamente con Python"
        },
        {
            "name": "Nave de Prueba 2",
            "faction": "vega",
            "type": "tank",
            "techLevel": "20",
            "description": "Subida automáticamente con Python"
        }
    ]

    for ship in mock_ships:
        try:
            # Crea un documento nuevo (Firestore asigna el ID automáticamente)
            ships_ref.add(ship)
            print(f"✅ Nave subida exitosamente: {ship['name']}")
        except Exception as e:
            print(f"❌ Error al subir {ship['name']}: {e}")

if __name__ == "__main__":
    print("--- PirateWyki Data Importer ---")
    db = initialize_firebase()
    if db:
        # Descomenta la siguiente línea cuando tengas tu service-account-key.json
        # upload_mock_ships(db)
        print("Conexión preparada. Coloca tu archivo JSON y descomenta la función para probar.")
