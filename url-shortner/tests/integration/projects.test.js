import Project from "#src/models/models.project";
import appPromise from "#src/server"; // Replace with your app entry point
import { generateMongoObjectId } from "#src/utils/mongoIdGenerator";
import request from "supertest";

jest.mock("#src/middlewares/authenticate", () => ({
  authenticate: jest.fn((req, res, next) => {
    req.locals = {
      user: { id: "6763ebdbc68681a08bb6652e", _id: "mockUserId" },
    };
    next();
  }),
}));

let app;

beforeAll(async () => {
  app = await appPromise;
});

describe("ProjectController", () => {
  let projectId;

  describe("POST /projects", () => {
    it("should create a new project", async () => {
      const newProject = {
        name: "Project A",
        description: "Test Project",
        start_date: "2024-12-01",
        end_date: "2024-12-31",
        assigned_users: ["6763ebdbc68681a08bb6652e"],
        title: "Project Title",
      };
      const mockToken = "mockToken123";

      const response = await request(app)
        .post("/api/v1/projects")
        .send(newProject)
        .set("Authorization", `Bearer ${mockToken}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Project created successfully.");
    });
  });

  describe("GET /projects/:id", () => {
    it("should fetch a project by ID", async () => {
      const project = await Project.create({
        name: "Project A",
        description: "Test Project",
        ownerId: "6763ebdbc68681a08bb6652e",
        start_date: "2024-12-01",
        end_date: "2024-12-31",
        assigned_users: [generateMongoObjectId()],
        title: "Project Title",
      });
      projectId = project._id;

      const response = await request(app)
        .get(`/api/v1/projects/${projectId}`)
        .set("Authorization", `Bearer mockToken123`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Project retrieved successfully.");
    });
  });

  describe("PUT /projects/:id", () => {
    it("should update a project", async () => {
      const project = await Project.create({
        description: "Test Project",
        ownerId: "6763ebdbc68681a08bb6652e",
        start_date: "2024-12-01",
        end_date: "2024-12-31",
        assigned_users: [generateMongoObjectId()],
        title: "Project Title",
      });
      projectId = project._id;

      const updatedData = { title: "Updated Project A" };
      const response = await request(app)
        .patch(`/api/v1/projects/${projectId}`)
        .send(updatedData)
        .set("Authorization", `Bearer mockToken123`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Project updated successfully.");
      expect(response.body.data.title).toBe("Updated Project A");
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should delete a project", async () => {
      const project = await Project.create({
        name: "Project A",
        description: "Test Project",
        ownerId: "6763ebdbc68681a08bb6652e",
        start_date: "2024-12-01",
        end_date: "2024-12-31",
        assigned_users: [generateMongoObjectId()],
        title: "Project Title",
      });
      projectId = project._id;

      const response = await request(app).delete(
        `/api/v1/projects/${projectId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Project deleted successfully.");
    });
  });
});
