import cv2
from pyzbar.pyzbar import decode

def scan_barcode():
    cap = cv2.VideoCapture(0)
    print("Scanning barcode... (Press Q to stop)")
    
    while True:
        _, frame = cap.read()
        cv2.imshow('Barcode Scanner', frame)
        
        decoded_objects = decode(frame)
        if decoded_objects:
            barcode = decoded_objects[0].data.decode('utf-8')
            cap.release()
            cv2.destroyAllWindows()
            name = input(f"Enter product name for barcode {barcode}: ")
            return {'barcode': barcode, 'name': name}
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    return None
