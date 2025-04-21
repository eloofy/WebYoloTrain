# tasks.py
from celery import shared_task
from ultralytics import YOLO
from webyolo.tasks.models import TrainingTask
from webyolo.datasets.models import Dataset
from clearml import Task as ClearMLTask
import os
import yaml
import torch

import matplotlib
matplotlib.use('Agg')

@shared_task(bind=True)
def run_yolov8_training(self, task_id):
    try:
        task_obj = TrainingTask.objects.get(id=task_id)
    except TrainingTask.DoesNotExist:
        return "Task not found"

    dataset_obj = Dataset.objects.get(id=task_obj.dataset_id.id)

    try:
        clearml_task = ClearMLTask.init(
            project_name="YOLOv8 Training",
            task_name=task_obj.name_task,
            reuse_last_task_id=False
        )
        task_url = clearml_task.get_output_log_web_page()
        clearml_task.connect(task_obj.config)
        task_obj.experiment_url = task_url
        task_obj.save()

        config = task_obj.config or {}
        model_config = config.get("model_config", {})

        weights = model_config.get("model", "yolov8n.pt")
        imgsz = model_config.get("imgsz", 640)
        epochs = int(model_config.get("epochs", 2))
        batch = model_config.get("batch", 16)
        device = model_config.get("device", "auto")
        device = "0" if (device == "auto" and torch.cuda.is_available()) else "cpu"
        lr0 = model_config.get("lr0", 0.01)
        lrf = model_config.get("lrf", 0.001)
        momentum = model_config.get("momentum", 0.98)
        weight_decay = model_config.get("weight_decay", 0.005)
        seed = model_config.get("seed", 12345)

        augment_config = config.get("augment_config", {})
        hsv_h = augment_config.get("hsv_h", 0.01)
        hsv_s = augment_config.get("hsv_s", 0.5)
        hsv_v = augment_config.get("hsv_v", 0.1)
        mixup = augment_config.get("mixup", 0.01)
        scale = augment_config.get("scale", 0.8)
        shear = augment_config.get("shear", 0.2)
        fliplr = augment_config.get("fliplr", 0.5)
        flipud = augment_config.get("flipud", 0.5)
        mosaic = augment_config.get("mosaic", 0.1)
        degrees = augment_config.get("degrees", 30)
        erasing = augment_config.get("erasing", 0.2)
        translate = augment_config.get("translate", 0.1)
        copy_paste = augment_config.get("copy_paste", 0)

        data_folder = dataset_obj.file.path
        data_yaml_path = os.path.join(data_folder, "data.yaml")
        data_yaml_content = {
            "train": os.path.join(data_folder, "train"),
            "val": os.path.join(data_folder, "valid"),
            "nc": 1,
            "names": ["object"],
        }
        with open(data_yaml_path, "w") as f:
            yaml.dump(data_yaml_content, f, default_flow_style=False)

        project = model_config.get("project", "runs/train")

        task_obj.status = "running"
        task_obj.save()

        model = YOLO(weights)
        results = model.train(
            data=data_yaml_path,
            imgsz=imgsz,
            epochs=epochs,
            batch=batch,
            device=device,
            lr0=lr0,
            lrf=lrf,
            momentum=momentum,
            weight_decay=weight_decay,
            seed=seed,
            project=project,
            name=task_obj.name_task,
            task="detect",
            hsv_h=hsv_h,
            hsv_s=hsv_s,
            hsv_v=hsv_v,
            mixup=mixup,
            scale=scale,
            shear=shear,
            fliplr=fliplr,
            flipud=flipud,
            mosaic=mosaic,
            degrees=degrees,
            erasing=erasing,
            translate=translate,
            copy_paste=copy_paste,
        )

        task_obj.status = "success"
        task_obj.save()
        clearml_task.close()

        return "Training complete"
    except Exception as e:
        task_obj.status = "failed"
        task_obj.save()

        clearml_task.close()
        return f"Training failed: {str(e)}"