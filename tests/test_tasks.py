from app.schemas.task import TaskCreate, TaskStatus, TaskUpdate

def test_task_create_schema_valid():
    task = TaskCreate(title="Test", status=TaskStatus.ACTIVE)
    assert task.title == "Test"
    assert task.status == TaskStatus.ACTIVE

def test_task_update_schema_partial():
    task = TaskUpdate(title="Nowy tytuł")
    task_dict = task.model_dump(exclude_unset=True)
    assert "title" in task_dict
    assert "status" not in task_dict
    assert "description" not in task_dict
    assert "schedule" not in task_dict