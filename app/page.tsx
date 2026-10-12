import { buildLessons } from "../src/teaching";
import LearningExperience from "./experience";

export default function Page() {
  return <LearningExperience lessons={buildLessons()} />;
}
