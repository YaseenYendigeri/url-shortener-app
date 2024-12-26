import {
  createProject,
  deleteProject,
  updateProject,
} from "#src/services/services.project";

import Project from "#src/models/models.project";

jest.mock("#src/models/models.project", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    find: jest.fn(),
  },
}));

describe("Unit Tests: Project Service", () => {
  describe("createProject", () => {
    it("should create a project", async () => {
      const data = {
        name: "Project A",
        description: "Test Project",
        ownerId: "mockUserId",
        start_date: "2024-12-01",
        end_date: "2024-12-31",
        assigned_users: ["mockUserId"],
        title: "Project Title",
      };

      Project.create.mockResolvedValue(data);

      const result = await createProject(data);

      expect(Project.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });
  });

  describe("updateProject", () => {
    it("should update a project", async () => {
      const id = "mockProjectId";
      const ownerId = "mockUserId";
      const updateData = { title: "Updated Project A" };
      const updatedProject = { _id: id, ...updateData };

      Project.findOneAndUpdate.mockResolvedValue(updatedProject);

      const result = await updateProject(id, ownerId, updateData);

      expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: id, ownerId },
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedProject);
    });
    it("should throw an error if project with ID does not exist", async () => {
      const id = "nonExistentId";
      const ownerId = "mockUserId";
      const updateData = { title: "Updated Project A" };

      Project.findOneAndUpdate.mockResolvedValue(null);

      await expect(updateProject(id, ownerId, updateData)).rejects.toThrow(
        "Project not found or you do not have permission to update it."
      );
    });
  });

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      const id = "mockProjectId";
      const ownerId = "mockUserId";
      const deletedProject = { _id: id, name: "Project A" };

      Project.findOneAndDelete.mockResolvedValue(deletedProject);

      const result = await deleteProject(id, ownerId);

      expect(Project.findOneAndDelete).toHaveBeenCalledWith({
        _id: id,
        ownerId,
      });
      expect(result).toEqual(deletedProject);
    });
  });
});
