import pdf2image
from PIL import Image
import time
import boto3
import os, os.path
import sys
import glob
import socket
import win32com.client
import requests
import cv2
import numpy as np
import numpy

socket.getaddrinfo('127.0.0.1', 8080)
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


# This method converts the pdf into a set of images.
def pdftopil(f):

    start_time = time.time()
    pil_images = pdf2image.convert_from_path(f, dpi=DPI, output_folder=OUTPUT_FOLDER, first_page=FIRST_PAGE,
                                             last_page=LAST_PAGE, fmt=FORMAT, thread_count=THREAD_COUNT, userpw=USERPWD,
                                             use_cropbox=USE_CROPBOX, strict=STRICT)
    print("Time taken : " + str(time.time() - start_time))
    save_images(pil_images)


# This method converts a .ppt/.pptx into a pdf file
def convert(files, formatType=32):
    powerpoint = win32com.client.Dispatch("Powerpoint.Application")
    print('test1')
    # powerpoint.Interactive = 0
    # powerpoint.Visible = 1
    print('test2')
    for filename in files:
        print('test3')
        newname = os.path.splitext(filename)[0] + ".pdf"
        deck = powerpoint.Presentations.Open(filename)
        print('Filename: ' + filename + 'Newname:' + newname)
        print(formatType)
        # powerpoint.Presentations.Close()
        deck.SaveAs(newname, formatType)
        # deck.Close()
    # powerpoint.Quit()


# This method stores the individual slides on an s3 bucket.
def save_images(pil_images):
    # This method helps in converting the images in PIL Image file format to the required image format
    s3 = boto3.client('s3')
    index = 1
    Slides = []
    for image in pil_images:
        image.save("Slides/Slide " + str(index) + ".png")
        # s3.put_object(Body = 'image12.png', Bucket = 'cdap-slides-bucket', Key = 'folder/{}'.format('frame' + str(index) + '.jpg'))
        # s3.upload_file('Slides/Slides ' + str(index) + '.png', 'cdap-slides-bucket', 'Lecture5/{}'.format('frame' + str(index) + '.jpg'))
        index += 1
    dir = 'Slides'
    slide_count = len([name for name in os.listdir(dir) if os.path.join(dir, name)])
    j = 1
    while j <= slide_count:
        s3.upload_file('Slides/Slide ' + str(j) + '.png', 'cdap-slides-bucket',
                       'Lecture7-test1/{}'.format('Slide' + str(j) + '.jpg'))
        timestamp = findTimestamp('Slides/Slide ' + str(j) + '.png')
        location = boto3.client('s3').get_bucket_location(Bucket='cdap-slides-bucket')['LocationConstraint']
        #url = "https://s3-%s.amazonaws.com/%s/%s" % (location, 'cdap-slides-bucket', key)
        url = "https://%s.s3.%s.amazonaws.com/%s" % ('cdap-slides-bucket', location, 'Slide' + str(index) + '.jpg')
        r1 = requests.put('http://localhost:3000/v1/metadata/updateSlides/', params=url)
        r2 = requests.put('http://localhost:3000/v1/metadata/updateTimestamp/', params=timestamp)
        j += 1

    # b = pickle.dumps(Slides)
    # s3.put_object(Body=Slides)


# This method returns the occurence of a given slide(in seconds)
def findTimestamp(slide):
    path, dirs, files = next(os.walk("/home/ubuntu/v-tutor-backend/v-tutor-backend/frames/extracted/"))
    file_count = len(files)
    print(file_count)
    i = "00001"

    while int(i) < file_count:
        img1 = cv2.imread(slide, 0)
        print(str(img1.shape[0]) + "," + str(img1.shape[1]))
        # print('frames/frame'+ i +'.jpg')
        # getting the difference of the images
        img2 = cv2.imread('frames/frame' + i + '.jpg', 0)
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
        request = requests.put('http://localhost:3000/v1/metadata/updateTimestamp/', params=timestamp)
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


if __name__ == "__main__":
    pdftopil(sys.argv[0])
