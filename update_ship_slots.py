import firebase_admin
from firebase_admin import credentials, firestore
import os

"""
PirateWyki: Update Ship Slots Migration
-------------------------------------
Este script actualiza todos los documentos de la colección 'ships' para asegurarse 
de que tengan el campo 'componentSlotsMax' y un array 'componentSlots' inicializado.
"""

def initialize_firebase():
    cred_path = 'service-account-key.json'
    if not os.path.exists(cred_path):
        print(f"Error: No se encontró '{cred_path}'.")
        return None
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        print(f"Error: {e}")
        return None

def migrate_ships(db):
    print("Obteniendo naves...")
    ships_ref = db.collection('ships')
    ships = ships_ref.stream()
    
    count = 0
    for ship_doc in ships:
        ship_id = ship_doc.id
        data = ship_doc.to_dict()
        
        updates = {}
        
        # Seteo por defecto de slots si no existen
        if 'componentSlotsMax' not in data:
            updates['componentSlotsMax'] = 6
            
        if 'componentSlots' not in data:
            # Inicializar con slots vacíos según el máximo
            max_slots = data.get('componentSlotsMax', 6)
            updates['componentSlots'] = [{"type": "", "componentId": ""} for _ in range(max_slots)]
            
        if updates:
            ships_ref.doc(ship_id).update(updates)
            print(f"✅ Nave actualizada: {data.get('name', ship_id)}")
            count += 1
            
    print(f"Total de naves migradas: {count}")

if __name__ == "__main__":
    db = initialize_firebase()
    if db:
        migrate_ships(db)
    else:
        print("No se pudo conectar. Verifica tu service-account-key.json")
