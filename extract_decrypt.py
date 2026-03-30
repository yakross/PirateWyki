import re

"""
PirateWyki: Extract Decrypt Requirements Utility
----------------------------------------------
Permite extraer IDs de componentes y naves de textos planos para facilitar 
la creación de requisitos de decodificación.
"""

def extract_requirements(text):
    # Busca patrones comunes como "Nave: ID", "Item: ID", etc.
    # O simplemente extrae palabras que parezcan IDs de Pirate Galaxy
    
    # Ejemplo de regex para capturar algo entre comillas o después de dos puntos
    items = re.findall(r'(?:item|ship|nave|componente):\s*([a-zA-Z0-9_\-]+)', text, re.I)
    
    print("--- Requisitos Encontrados ---")
    for i in items:
        print(f"ID Detectado: {i}")
    
    return items

if __name__ == "__main__":
    sample_text = """
    Para este plano necesitas:
    Nave: x-ship-tank-vega
    Item: component-armor-vega-1
    Item: component-engine-vega-1
    """
    extract_requirements(sample_text)
