import { lessons } from "../domain/learning";
import AppShell from "./shell";

export default function Page() {
  return <AppShell lessons={lessons()} />;
}
