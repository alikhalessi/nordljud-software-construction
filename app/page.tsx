import LearningClient from "./learning-client";
import { getMissions } from "../lib/missions";

export default function Home() {
  return <LearningClient missions={getMissions()} />;
}
