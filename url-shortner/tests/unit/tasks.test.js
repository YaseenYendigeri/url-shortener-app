import {
  assignTask,
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
} from "#src/services/services.task";

import Project from "#src/models/models.project";
import Task from "#src/models/models.task";

jest.mock("#src/models/models.project", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

jest.mock("#src/models/models.task", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

describe("Unit Tests: Task Service", () => {
  describe("createTask", () => {
    it("should create a task", async () => {
      const data = { title: "Task A", projectId: "mockProjectId" };
      const userId = "mockUserId";

      Project.findOne.mockResolvedValue({
        _id: "mockProjectId",
        ownerId: "mockUserId",
      });
      Task.create.mockResolvedValue(data);

      const result = await createTask(data, userId);

      expect(Project.findOne).toHaveBeenCalledWith({
        _id: "mockProjectId",
        ownerId: "mockUserId",
      });
      expect(Task.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const id = "mockTaskId";
      const updateData = { status: "In Progress" };
      const userId = "mockUserId";

      Task.findById.mockResolvedValue({ _id: id, projectId: "mockProjectId" });
      Project.findOne.mockResolvedValue({
        _id: "mockProjectId",
        ownerId: userId,
      });
      Task.findByIdAndUpdate.mockResolvedValue({ _id: id, ...updateData });

      const result = await updateTask(id, updateData, userId);

      expect(Task.findById).toHaveBeenCalledWith(id);
      expect(Project.findOne).toHaveBeenCalledWith({ _id: "mockProjectId" });
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(id, updateData, {
        new: true,
      });
      expect(result).toEqual({ _id: id, ...updateData });
    });
  });
  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const id = "mockTaskId";
      const deletedTask = { _id: id, title: "Task A" };

      Task.findByIdAndDelete.mockResolvedValue(deletedTask);

      const result = await deleteTask(id);

      expect(Task.findByIdAndDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual(deletedTask);
    });
  });

  describe("getTaskById", () => {
    it("should fetch a task by ID", async () => {
      const id = "676481277194495b4639d2fc";
      const task = { _id: id, title: "Task A" };

      Task.findById.mockResolvedValue(task);

      const result = await getTaskById(id);

      expect(Task.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(task);
    });
  });

  describe("assignTask", () => {
    it("should assign a task to a user", async () => {
      const id = "6764848339291521f9fc54ed";
      const assignedTo = "6763ebdbc68681a08bb6652e";
      const task = { _id: id, title: "Task A", assignedTo: null };

      Task.findById.mockResolvedValue(task);
      task.assignedTo = assignedTo;
      task.save = jest.fn().mockResolvedValue(task);

      const result = await assignTask(id, assignedTo);

      expect(Task.findById).toHaveBeenCalledWith(id);
      expect(task.save).toHaveBeenCalled();
      expect(result.assignedTo).toBe(assignedTo);
    });
  });
});
