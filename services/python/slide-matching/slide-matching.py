import cv2
import numpy
import numpy as np
import os
import ffmpeg
import subprocess
import boto3

s3 = boto3.resource('s3')
obj = s3.Object('cdap-slides-bucket', 'Lecture5')
body = obj.get()['Body'].read()

# Extracting a dataframe for every second
command = "ffmpeg -i TrimmedVideo.mp4 -vf fps=1 frames/frame%05d.jpg -hide_banner"
subprocess.call(command, shell=True)

path, dirs, files = next(os.walk("./frames"))
file_count = len(files)
print(file_count)
i = "00001"

while int(i) < file_count:
    img1 = cv2.imread(body[0], 0)
    print(str(img1.shape[0]) + "," + str(img1.shape[1]))
    # print('frames/frame'+ i +'.jpg')
    # getting the difference of the images
    img2 = cv2.imread('frames/frame' + i + '.jpg', 0)
    # print(img2.shape[0] + ", " + img2.shape[1]);
    #resizing the images
    print(str(img2.shape[0]) + "," + str(img2.shape[1]))
    res = cv2.absdiff(img1, img2)
    res = res.astype(np.uint8)
    percentage = (numpy.count_nonzero(res) * 100) / res.size
    print(percentage)

    if percentage < 1:
        print('match found : frames/frame' + i + '.jpg')
        break
    else:
        print(i)
        i = str(int(i)+1)
        while len(i) < 4:
            i = '0' + i
        print(i)
