import argparse
import ocr

ap = argparse.ArgumentParser()
ap.add_argument("--image_path",
                help="path to input images to be OCR'd", 
                default="/home/ubuntu/v-tutor-backend/v-tutor-backend/frames/extracted/")
ap.add_argument("-p", "--preprocess", type=str,
                help="type of preprocessing to be done", default="thresh")
args = vars(ap.parse_args())

ocr.run_ocr(args["image_path"], args["preprocess"])

print("\n")