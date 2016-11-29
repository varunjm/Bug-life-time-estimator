import csv
import math

lol = lambda lst, sz: [lst[i:i+sz] for i in range(0, len(lst), sz)]
with open('time.csv', 'rb') as csvfile:
    times = csv.reader(csvfile, delimiter='\n')
    time_listx = []
    for row in times:
        time_listx.append(float(row[0]))

    time_list = sorted(time_listx);
    buckets = lol(time_list, 116)
    m_map = {}
    for bucket in buckets:
        median = int(math.ceil(bucket[len(bucket)/2]))
        for element in bucket:
            m_map[element] = median

    print m_map

    f=open("data.csv",'w')
    for element in time_listx:
        f.write(str(m_map[element])+'\n')
