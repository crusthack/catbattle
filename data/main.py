import os
import shutil

BASE_DIR = os.path.join(os.getcwd(), "unit")        # 원본 폴더
OUT_DIR = os.path.join(os.getcwd(), "newunit")      # 출력 폴더

os.makedirs(OUT_DIR, exist_ok=True)

kinds = ["f", "c", "s", "u"]

for i in range(0, 823):  # id: 000 ~ 822
    id_str = f"{i:03d}"
    unit_dir = os.path.join(BASE_DIR, id_str)

    if not os.path.isdir(unit_dir):
        continue  # 해당 유닛 폴더가 없으면 패스

    # newunit/{id} 폴더 생성
    out_unit_dir = os.path.join(OUT_DIR, id_str)
    os.makedirs(out_unit_dir, exist_ok=True)

    # -------------------------------
    # 1) f/c/s/u maanim 파일 복사
    # -------------------------------
    for k in kinds:
        src = os.path.join(unit_dir, k, f"{id_str}_{k}02.maanim")
        dst = os.path.join(out_unit_dir, f"{id_str}_{k}02.maanim")

        if os.path.isfile(src):
            print(f"Copying {src} -> {dst}")
            shutil.copy2(src, dst)
    
    # -------------------------------
    # 2) unit{id}.csv 파일 복사
    # -------------------------------
    csv_src = os.path.join(unit_dir, f"unit{id_str}.csv")
    csv_dst = os.path.join(out_unit_dir, f"unit{id_str}.csv")

    if os.path.isfile(csv_src):
        print(f"Copying {csv_src} -> {csv_dst}")
        shutil.copy2(csv_src, csv_dst)

print("Done.")
