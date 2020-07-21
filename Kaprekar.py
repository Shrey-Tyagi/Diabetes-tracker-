# Here is the task 1 
def kaprekarRec(n, prev):

    if (n == 0):
        return 0

    prev = n
    digits = [0] * 4
    for i in range(4):
        digits[i] = n % 10
        n = int(n/10)
    digits.sort()
    asc = 0
    desc = 0
    for i in range(4):
        asc = asc * 10 + digits[i]
        desc = desc * 10 + digits[3-i]


    diff = abs(asc - desc)
    if (diff == prev):
        return diff

    return kaprekarRec(diff, prev)


rev = 0
print(kaprekarRec(1080,rev))
print(kaprekarRec(1092,rev))
print(kaprekarRec(7980,rev))
