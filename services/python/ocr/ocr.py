from PIL import Image # import the necessary packages
import pytesseract
import cv2
import os
import numpy as np
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
from keras.models import load_model
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True

WIDTH = 299
HEIGHT = 299
MODEL_FILE = 'models/image_classifier_vgg16.model'
model = load_model(MODEL_FILE)
for l in model.layers:
    l.trainable = False

# ============================================================================================

# ============================================================================================

def predict(model, img):
    """Run model prediction on image
    Args:
        model: keras model
        img: PIL format image
    Returns:
        list of predicted labels and their probabilities 
    """
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    preds = model.predict(x)
    return preds[0]

# ============================================================================================

# ============================================================================================

def predict_frame_label(frame_path):
    img = image.load_img(frame_path, target_size=(HEIGHT, WIDTH))
    preds = predict(model, img)
    if(abs(preds[0] - preds[1]) < 0.4):
        prediction = 'code'
    else:
         prediction = 'code' if np.argmax(preds) == 0 else 'notcode'
    # print(preds[1] + 'not code') 
    return prediction

# ============================================================================================

# ============================================================================================

def extract_text(mpath_to_File, mpreprocess):
	# load the example image and convert it to grayscale
	image = cv2.imread(mpath_to_File)
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

	# check to see if we should apply thresholding to preprocess the image
	if mpreprocess == "thresh":
		gray = cv2.threshold(gray, 0, 255,
			cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

	# make a check to see if median blurring should be done to remove
	# noise
	elif mpreprocess == "blur":
		gray = cv2.medianBlur(gray, 3)

	# write the grayscale image to disk as a temporary file so we can
	# apply OCR to it
	filename = "{}.png".format(os.getpid())
	cv2.imwrite(filename, gray)

	# load the image as a PIL/Pillow image, apply OCR, and then delete
	# the temporary file
	text = pytesseract.image_to_string(Image.open(filename))
	os.remove(filename)
	return text.encode('utf-8')

# ============================================================================================

# ============================================================================================

def write_to_disk(string, filename):
	output_filename = filename.replace("jpg", "txt")
	save_path = "/home/ubuntu/v-tutor-backend/v-tutor-backend/ocroutput"
	if not (os.path.exists(save_path)):
		try:  
			os.mkdir(save_path)
		except OSError:  
			print ("Creation of the directory %s failed" % save_path)
		else:  
			print ("Successfully created the directory %s " % save_path)
	with open(os.path.join(save_path, output_filename), "wb") as ocr_file:
		ocr_file.write(string)
	return

# ============================================================================================

# ============================================================================================

def run_ocr(image_path, preprocess="thresh"):
	files = os.listdir(image_path)
	print("OCR Script starting...")
	for file in files:
		path_to_File = os.path.join(image_path, file)
		if (predict_frame_label(path_to_File) == 'code'):
			print("code present in " + file + " running ocr")
			write_to_disk(extract_text(path_to_File, preprocess), file)
		else:
			print("no code present in " + file + " skipping")
	print("OCR Completed for all lines")
	return

# ============================================================================================
