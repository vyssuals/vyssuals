import pandas as pd
import random

# Define the headers for the door schedule and lists of possible values for each header
headers = ["Door Number", "Location", "Material", "Type", "Width", "Height", "Fire Rating", "Hardware Set", 
           "Color", "Style", "Frame Material", "Frame Type", "Threshold", "Seal", "Closer", "Lock", 
           "Handle", "Hinge", "Stop", "Vision Panel", "Kick Plate", "Push Plate", "Pull Handle", 
           "Automatic Operator", "Weather Strip", "Acoustic Seal", "Fire Seal", "Smoke Seal", "Drop Seal", "Door Closer"]

locations = ["Main Entrance", "Office 101", "Office 102", "Conference Room", "Kitchen", "Bathroom", "Storage Room", "Server Room"]
materials = ["Wood", "Steel", "Glass", "Aluminium"]
types = ["Single", "Double"]
widths = ["24 in", "30 in", "36 in", "42 in", "48 in", "60 in", "72 in"]
heights = ["80 in", "84 in", "96 in"]
fire_ratings = ["None", "20 min", "45 min", "1 hr", "1.5 hr", "3 hr"]
hardware_sets = ["HS1", "HS2", "HS3", "HS4", "HS5"]
colors = ["White", "Black", "Gray", "Red", "Blue", "Green", "Yellow"]
styles = ["Modern", "Traditional", "Industrial", "Rustic", "Contemporary"]
frame_materials = ["Wood", "Steel", "Aluminium", "PVC"]
frame_types = ["Flush", "Panel", "Glazed", "Louvered"]
thresholds = ["None", "Wood", "Aluminium", "Brass", "Stainless Steel"]
seals = ["None", "Acoustic", "Smoke", "Fire", "Draft"]
closers = ["None", "Surface-mounted", "Concealed in frame", "Concealed in floor", "Concealed in door"]
locks = ["None", "Deadbolt", "Mortise", "Night latch", "Multi-point locking system"]
handles = ["Lever handle", "Door knob", "Pull handle", "Sliding door handle", "Thumb latch"]
hinges = ["Butt hinge", "Pivot hinge", "Continuous hinge", "Concealed hinge", "Piano hinge"]
stops = ["Floor stop", "Wall stop", "Hinge pin stop", "Baseboard stop", "Magnetic stop"]
vision_panels = ["None", "Square", "Rectangular", "Round", "Custom"]
kick_plates = ["None", "Stainless Steel", "Brass", "Aluminium", "PVC"]
push_plates = ["None", "Stainless Steel", "Brass", "Aluminium", "PVC"]
pull_handles = ["None", "Stainless Steel", "Brass", "Aluminium", "PVC"]
automatic_operators = ["None", "Low energy", "Full energy"]
weather_strips = ["None", "Adhesive-backed tape", "V strip", "Door sweep", "Bulb threshold"]
acoustic_seals = ["None", "Perimeter seal", "Door bottom seal", "Threshold seal", "Automatic door bottom seal"]
fire_seals = ["None", "Intumescent strip", "Smoke seal", "Combined fire and smoke seal"]
smoke_seals = ["None", "Brush strip", "Rubber seal", "Intumescent strip"]
drop_seals = ["None", "Automatic drop seal", "Threshold seal"]
door_closers = ["None", "Surface-mounted", "Concealed", "Floor spring", "Transom"]

# Step 2: Create a DataFrame with these headers
df = pd.DataFrame(columns=headers)

# Step 3: Generate 200 rows of data
for i in range(1, 201):
    door_number = f"D{i:03}"  # This will keep the door number in the format DXXX
    location = random.choice(locations)
    material = random.choice(materials)
    type = random.choice(types)
    width = random.choice(widths)
    height = random.choice(heights)
    fire_rating = random.choice(fire_ratings)
    hardware_set = random.choice(hardware_sets)
    color = random.choice(colors)
    style = random.choice(styles)
    frame_material = random.choice(frame_materials)
    frame_type = random.choice(frame_types)
    threshold = random.choice(thresholds)
    seal = random.choice(seals)
    closer = random.choice(closers)
    lock = random.choice(locks)
    handle = random.choice(handles)
    hinge = random.choice(hinges)
    stop = random.choice(stops)
    vision_panel = random.choice(vision_panels)
    kick_plate = random.choice(kick_plates)
    push_plate = random.choice(push_plates)
    pull_handle = random.choice(pull_handles)
    automatic_operator = random.choice(automatic_operators)
    weather_strip = random.choice(weather_strips)
    acoustic_seal = random.choice(acoustic_seals)
    fire_seal = random.choice(fire_seals)
    smoke_seal = random.choice(smoke_seals)
    drop_seal = random.choice(drop_seals)
    door_closer = random.choice(door_closers)

    data = [door_number, location, material, type, width, height, fire_rating, hardware_set, color, style, 
            frame_material, frame_type, threshold, seal, closer, lock, handle, hinge, stop, vision_panel, 
            kick_plate, push_plate, pull_handle, automatic_operator, weather_strip, acoustic_seal, fire_seal, 
            smoke_seal, drop_seal, door_closer]
    
    df = pd.concat([df, pd.DataFrame([data], columns=headers)], ignore_index=True)

# Step 4: Export the DataFrame to a CSV file
df.to_csv("door_schedule.csv", index=False)