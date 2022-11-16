# Random Password Generator

import random


def shuffle(string):
    temp_list = list(string)
    random.shuffle(temp_list)
    return ''.join(temp_list)

def generate():
    uppercaseLetter1 = chr(random.randint(65, 90))
    uppercaseLetter2 = chr(random.randint(65, 90))
    lowercaseLetter1 = chr(random.randint(97, 122))
    lowercaseLetter2 = chr(random.randint(97, 122))
    digit1 = chr(random.randint(48, 57))
    digit2 = chr(random.randint(48, 57))
    punctuationSign1 = chr(random.randint(33, 38))
    punctuationSign2 = chr(random.randint(33, 38))
    if punctuationSign1 == '"':
        punctuationSign1= punctuationSign1.replace('"','\\"')
    if punctuationSign2 == '"':
        punctuationSign2 = punctuationSign2.replace('"','\\"')
    password = uppercaseLetter1 + uppercaseLetter2 + lowercaseLetter1 + lowercaseLetter2 + digit1 + digit2 + punctuationSign1 + punctuationSign2
    shuffle(password)
    return password