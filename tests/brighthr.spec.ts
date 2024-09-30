import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker/locale/en";
import { env } from "process";

const login = async (page) => {
  await page.goto("https://sandbox-login.brighthr.com/");

  await expect(page).toHaveTitle(/Bright - Login/);

  await page.fill(
    'input[name="email"]',
    process.env.TEST_EMAIL || "ibuzsfujugyiffvuqd@hthlm.com",
  );
  await page.fill(
    'input[name="password"]',
    process.env.TEST_PASSWORD || "Password1066",
  );

  await page.click('button[type="submit"]');

  await expect(page).toHaveTitle(/Dashboard - BrightHR/);
};

const addEmployee = async (page, employee) => {
  await page.click('button:text("Add employee")');
  await page.fill('input[name="firstName"]', employee.firstName);
  await page.fill('input[name="lastName"]', employee.lastName);
  await page.fill('input[name="email"]', employee.email);
  await page.fill('input[name="phoneNumber"]', employee.phoneNumber);
  await page.fill('input[name="jobTitle"]', employee.jobTitle);
  await page.getByTestId("input-selector").click();
  await page.locator(`[aria-label="${employee.startDate}"]`).click();
  await page.click('button:text("Save new employee")');
};

const addAnotherEmployee = async (page, employee) => {
  await page.click('button:text("Add another employee")');
  await page.fill('input[name="firstName"]', employee.firstName);
  await page.fill('input[name="lastName"]', employee.lastName);
  await page.fill('input[name="email"]', employee.email);
  await page.fill('input[name="phoneNumber"]', employee.phoneNumber);
  await page.fill('input[name="jobTitle"]', employee.jobTitle);
  await page.getByTestId("input-selector").click();
  await page.locator(`[aria-label="${employee.startDate}"]`).click();
  await page.click('button:text("Save new employee")');
  await page.click('button:text("Add another employee")');
};

// Define a reusable employee data generator
const generateEmployeeData = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.number({ style: "international" }),
    jobTitle: faker.person.jobTitle(),
    startDate: "Sun Sep 08 2024",
  };
};

test.describe("Employee Management", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("add employee and then another employee", async ({ page }) => {
    await page.goto("/employee-hub");

    await expect(page).toHaveTitle(/Employee Hub - BrightHR/);

    const employee1 = generateEmployeeData();
    const employee2 = generateEmployeeData();

    await addEmployee(page, employee1);

    await addAnotherEmployee(page, employee2);

    await page.goto("/employee-hub");

    await page.fill(
      'input[placeholder="Name or job title..."]',
      employee1.lastName,
    );

    await expect(page.getByText(employee1.lastName).last()).toBeVisible();

    await page.fill(
      'input[placeholder="Name or job title..."]',
      employee2.lastName,
    );

    await expect(page.getByText(employee2.lastName).last()).toBeVisible();
  });
});
