import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  // https://github.com/nrwl/nx/blob/master/packages/jest/src/utils/config/get-jest-projects.ts
  projects: await getJestProjectsAsync(),
});
