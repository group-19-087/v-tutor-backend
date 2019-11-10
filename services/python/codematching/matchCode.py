from difflib import SequenceMatcher
import os

# ============================================================================================

def extract_timestamp(seconds):
    m, s = divmod(seconds, 60)
    h, m = divmod(m, 60)
    return h, m, s
# ============================================================================================
# ============================================================================================

def match(path_to_code_file, path_to_frames):
    lines_in_source_code = list()       
    
    with open(path_to_code_file) as code:
        for line in code:
            lines_in_source_code.append(line.strip())
            
    data = {
        "filename": path_to_code_file, 
        "lines":[]
        }

    # lines_in_source_code.reverse()
    frames = os.listdir(path_to_frames)
    sorted_frames = sorted(frames, reverse = True) # read frames in reverse

    for idx, sc_line in enumerate(lines_in_source_code):
        # print("LINE: ", idx, " : ", sc_line[0:10])
        max_ratio = 0.0
        cur_ratio = 0.0
        max_ratio_frame = ""
        if len(sc_line) < 3:
            # print("continue : ", sc_line)
            continue

        for file in sorted_frames:
            path_to_File = os.path.join(path_to_frames, file)
            with open(path_to_File) as f:
                for i, line in enumerate(f):
                    cur_ratio = SequenceMatcher(None, sc_line, line).ratio()
                    if(cur_ratio >= max_ratio):
                        max_ratio = cur_ratio
                        max_ratio_frame = file
                    # # print("line ", i, " ratio: ", SequenceMatcher(None, sc_line, line).quick_ratio())
                    # print("line ", i, " ratio: ", cur_ratio)

        frame_number = int(max_ratio_frame.split(".")[0])
        seconds = frame_number * 5 # calculated with [1/(fps that the video is sampled at)] ie. 1/0.2
        
        h, m, s = extract_timestamp(seconds)
        timestamp = '{:d}:{:02d}:{:02d}'.format(h, m, s)

        line = {
            "content": sc_line,
            "timestamp": timestamp,
            "seconds": seconds
        }
        data["lines"].append(line)

    print data
# ============================================================================================
