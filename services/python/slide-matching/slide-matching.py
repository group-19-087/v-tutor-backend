import requests
import cv2
import numpy as np
import numpy
import json
import sys
import time
from pdf2image import convert_from_path
import boto3
import os
# import ConfigParser



# socket.getaddrinfo('127.0.0.1', 8080)
# DECLARE CONSTANTS
# PDF_PATH = "C:\\Users\\HP\\Desktop\\Research\\Lecture-05-2018-v1.pdf"
DPI = 200
OUTPUT_FOLDER = None
FIRST_PAGE = None
LAST_PAGE = None
FORMAT = 'jpg'
THREAD_COUNT = 1
USERPWD = None
USE_CROPBOX = False
STRICT = False
slides = []

# config = ConfigParser.ConfigParser()
# config.readfp(open(r'config'))

aws_access_key_id = ""
aws_secret_access_key = ""

url = sys.argv[1]
myfile = requests.get(url)
open('slides/slides.pdf', 'wb').write(myfile.content)

start_time = time.time()
pil_images = convert_from_path('slides/slides.pdf', dpi=DPI, output_folder=OUTPUT_FOLDER, first_page=FIRST_PAGE,
                                            last_page=LAST_PAGE, fmt=FORMAT, thread_count=THREAD_COUNT, userpw=USERPWD,
                                            use_cropbox=USE_CROPBOX, strict=STRICT)
print("Time taken : " + str(time.time()))

count = 0
slides = []
for page in pil_images:
    count = count +1
    # Saving the image file in the filesystem
    page.save('out-{}.jpg'.format(count), 'JPEG')

    # Uploading to S3
    session = boto3.Session(aws_access_key_id=aws_access_key_id,aws_secret_access_key=aws_secret_access_key)
    s3 = session.resource('s3')
    s3.meta.client.upload_file(Filename='out-{}.jpg'.format(count), Bucket='cdap-slides-bucket', Key='{}/slide-{}.jpg'.format(sys.argv[2],count), ExtraArgs={'ACL':'public-read'})
    # Matching frames with slides
    image = cv2.imread('out-{}.jpg'.format(count))
    height = np.size(image, 0)
    width = np.size(image, 1)
    imagesize = height + "x" + width
    command = "ffmpeg -i "+ sys.argv[2] + "-s " + imagesize + " -vf fps=1 frame/frame%04.jpg -hide_banner"
    timestamp = findTimestamp('out-{}.jpg'.format(count))
    print(timestamp)
    s3_url = "https://cdap-slides-bucket.s3.ap-south-1.amazonaws.com/{}/slide-{}.jpg".format(sys.argv[2], count)
    slides.append({"slide": s3_url, "timestamp":timestamp})
    os.remove('out-{}.jpg'.format(count))

request = requests.put('http://localhost:3000/v1/metadata/slides/{}'.format(sys.argv[2]), data=json.dumps({"slides": slides}))
if request.status_code == 200:
    print("DB updated")
else:
    print("Could not update DB")

# save_images(pil_images)


# This method returns the occurence of a given slide(in seconds)
def findTimestamp(slide):
    path, dirs, files = next(os.walk("C:/Users/HP/Desktop/Research/NUWAN SIR LEC VIDS/OOC Lecture Videos/test3/rame"))
    file_count = len(files)
    print(file_count)
    i = "00001"

    while int(i) < file_count:
        img1 = cv2.imread(slide, 0)
        print(str(img1.shape[0]) + "," + str(img1.shape[1]))
        # print('frames/frame'+ i +'.jpg')
        # getting the difference of the images
        img2 = cv2.imread('./frames/frame' + i + '.jpg', 0)
        # print(img2.shape[0] + ", " + img2.shape[1]);
        # resizing the images
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
            i = str(int(i) + 2)
            while len(i) < 4:
                i = '0' + i
            print(i)

        timestamp = getTimeInSeconds(i)
        # request = requests.put('http://localhost:3000/v1/metadata/updateTimestamp/', params=timestamp)
        return timestamp


# This method extracts the seconds from the file name
def getTimeInSeconds(filename):
    l = len(filename)
    print('length: ' + str(l))
    i=0
    time = ""
    while(i < l):
        if(filename[i].isnumeric()):
            if(filename[i] != '0'):
                time = str(time) + str(filename[i])
                print('Time: ' + time)
        i=i+1
    return time

