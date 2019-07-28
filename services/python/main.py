import argparse
import time

import ocr

ap = argparse.ArgumentParser()
ap.add_argument("--image_path",
                help="path to input images to be OCR'd", 
                default="/home/ubuntu/v-tutor-backend/v-tutor-backend/frames")
ap.add_argument("-p", "--preprocess", type=str,
                help="type of preprocessing to be done", default="thresh")
args = vars(ap.parse_args())

start = time.perf_counter()
ocr.run_ocr(args["image_path"], args["preprocess"])
ocr_time = time.perf_counter() - start

print("\n")
print("OCR completed in : ", ocr_time)
print("\n")