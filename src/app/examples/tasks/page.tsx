import { promises as fs } from 'fs';
import { Metadata } from 'next';
import path from 'path';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { taskSchema } from './data/schema';

export const metadata: Metadata = {
  title: 'Tasks',
  description: 'A task and issue tracker build using Tanstack Table.',
};

// Simulate a database read for tasks.
async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/examples/tasks/data/tasks.json')
  );

  const tasks = JSON.parse(data.toString());

  return z.array(taskSchema).parse(tasks);
}

export default async function TaskPage() {
  // const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

  const tasks = await getTasks();

  return (
    <>
      <div className="flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks
            </p>
          </div>
          <div className="ml-auto mr-4">
            <Button>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Add password
            </Button>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
