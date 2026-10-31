# -*- coding: utf-8 -*-
import subprocess
import os

BASE_DIR = r"F:\Earning Machine\distribution\digital_assets\way29_design_plugins"
os.chdir(BASE_DIR)

def run(cmd):
    print(f"Running: {cmd}")
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if p.stdout:
        print(p.stdout.strip())
    if p.stderr:
        print(p.stderr.strip())
    if p.returncode != 0:
        raise RuntimeError(f"Command failed with exit code {p.returncode}")
    return p

# 1. Git init and commit
run("git init")
run("git config user.name \"Milind Chatrabhuji\"")
run("git config user.email \"milind.chatrabhuji@gmail.com\"")
run("git add -A")
run("git commit -m \"feat(way29): Production Figma & Canva Commercial Plugins Suite v1.0.0\"")
run("git branch -M main")

# 2. Create public GitHub repo
run("gh repo create MilindChatrabhuji/production-design-plugins-suite --public --source=. --remote=origin --push")

# 3. Create GitHub Release v1.0.0
release_cmd = (
    "gh release create v1.0.0 "
    "\"releases/pack1_figma_clinical_infographics_v1.0.zip\" "
    "\"releases/pack1_figma_clinical_infographics_plugin_v1.0.zip\" "
    "\"releases/pack2_figma_edge_code_exporter_v1.0.zip\" "
    "\"releases/pack2_figma_edge_code_exporter_plugin_v1.0.zip\" "
    "\"releases/pack3_canva_sdk_marketplace_kit_v1.0.zip\" "
    "\"releases/pack3_design_monetization_canva_kit_v1.0.zip\" "
    "\"releases/pack3_canva_apps_sdk_kit_v1.0.zip\" "
    "\"releases/design_plugins_master_suite_v1.0.zip\" "
    "\"releases/production_design_plugins_master_suite_v1.0.zip\" "
    "--title \"v1.0.0: Production Figma & Canva Commercial Plugins Suite\" "
    "--notes-file \"CATALOG.md\""
)
run(release_cmd)

print("GitHub Repository and Release v1.0.0 created successfully!")
