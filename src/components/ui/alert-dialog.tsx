import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

type AlertDialogProps = {
	label: string
	description: string
    trigger: React.ReactNode
	onclick?: () => void
}

const AlertDialogDemo = ({trigger,label,description,onclick}:AlertDialogProps) => (
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild>
			{trigger}
		</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay className="fixed inset-0 bg-black/20" />
			<AlertDialog.Content className="animate-zoomIn fixed bg-background dark:ring dark:ring-gray-500 left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md p-[25px]">
				<AlertDialog.Title className="m-0 text-[17px] font-medium">
					{label}
				</AlertDialog.Title>
				<AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal dark:text-gray-300">
					{description}
				</AlertDialog.Description>
				<div className="flex justify-end gap-2">
					<AlertDialog.Cancel asChild>
						<button className="inline-flex h-[35px] items-center justify-center rounded px-[15px] font-medium leading-none outline-none outline-offset-1  select-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/10">
							Cancel
						</button>
					</AlertDialog.Cancel>
					<AlertDialog.Action asChild>
						<button onClick={onclick} className="inline-flex h-[35px] text-white dark:text-white items-center justify-center rounded bg-red-700 hover:bg-red-800 px-[15px] font-medium leading-none  outline-none outline-offset-1 select-none cursor-pointer">
							Yes, I sure
						</button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
);

export default AlertDialogDemo;
