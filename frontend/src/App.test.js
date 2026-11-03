import { render, screen } from "@testing-library/react";
import App from "./App";

const demoApplications = [
  { id: 1, company: "Acme Corp", role: "Backend Engineer", status: "Applied", notes: "Referral" },
  { id: 2, company: "Globex", role: "Software Engineer I", status: "Interview", notes: "Phone screen" },
];

afterEach(() => {
  jest.restoreAllMocks();
});

test("shows the page title and the add form", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => [] });
  render(<App />);
  expect(screen.getByText("Job Application Tracker")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Enter company name")).toBeInTheDocument();
  expect(await screen.findByText("No applications added yet.")).toBeInTheDocument();
});

test("loads saved applications from the API and shows them", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => demoApplications });
  render(<App />);
  expect(await screen.findByText("Acme Corp")).toBeInTheDocument();
  expect(screen.getByText("Globex")).toBeInTheDocument();
});

test("shows an error message when the API is down", async () => {
  jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
  render(<App />);
  expect(await screen.findByText("Failed to load applications.")).toBeInTheDocument();
});
