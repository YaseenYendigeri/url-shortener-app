import Task from "#src/models/models.task";
import request from "supertest";
import appPromise from "../../src/server";

jest.mock("#src/middlewares/authenticate", () => ({
  authenticate: jest.fn((req, res, next) => {
    req.locals = {
      user: { id: "6763ebdbc68681a08bb6652e", _id: "6763ebdbc68681a08bb6652e" },
    };
    next();
  }),
}));

let app;

beforeAll(async () => {
  app = await appPromise;
});

describe("Integration Tests: Task Controller", () => {
  let taskId;

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const newTask = {
        title: "Task A",
        description: "Test Task",
        due_date: "2024-12-31",
        projectId: "676481277194495b4639d2fc",
        assigned_to: "6763ebdbc68681a08bb6652e",
      };

      const response = await request(app).post("/api/v1/tasks").send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Task created successfully.");
    });
  });

  describe("PATCH /tasks/:id", () => {
    it("should update a task", async () => {
      const task = await Task.create({
        title: "Task A",
        description: "Test Task",
        due_date: "2024-12-31",
        projectId: "676481277194495b4639d2fc",
        assigned_to: "6763ebdbc68681a08bb6652e",
      });
      taskId = task._id;

      const updatedData = { title: "Updated Task A" };
      const response = await request(app)
        .patch(`/api/v1/tasks/${taskId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task updated successfully.");
      expect(response.body.data.title).toBe("Updated Task A");
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete a task", async () => {
      const task = await Task.create({
        title: "Task A",
        description: "Test Task",
        due_date: "2024-12-31",
        projectId: "676481277194495b4639d2fc",
        assigned_to: "6763ebdbc68681a08bb6652e",
      });
      taskId = task._id;

      const response = await request(app).delete(`/api/v1/tasks/${taskId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Task deleted successfully.");
    });
  });

  describe("GET /tasks/:id", () => {
    it("should fetch a task by project Id ID", async () => {
      const response = await request(app).get(
        `/api/v1/tasks/676481277194495b4639d2fc`
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Tasks retrieved successfully.");
    });
  });
});
