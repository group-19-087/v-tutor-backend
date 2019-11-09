import argparse
import matchCode

ap = argparse.ArgumentParser()
ap.add_argument("--ocr_path",
                help="path to OCR output", 
                default="/home/ubuntu/v-tutor-backend/v-tutor-backend/ocroutput/")
ap.add_argument("-c", "--code", type=str,
                help="path to code file",
                default="/home/ubuntu/v-tutor-backend/v-tutor-backend/ocroutput/services/python/codematching/code")
args = vars(ap.parse_args())

matchCode.match(args["ocr_path"], args["preprocess"])

print("\n")