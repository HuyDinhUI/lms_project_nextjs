
import  * as Checkbox  from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";


type CheckboxProps= {
    checked?: boolean
    onCheckedChange: (checked: Checkbox.CheckedState) => void
	classname?: string
}

const CheckboxDemo = ({checked,onCheckedChange, classname}: CheckboxProps) => (
	<form>
		<div className="flex items-center">
			<Checkbox.Root
				className={`${classname} ${checked ? 'bg-green-500' : 'bg-transparent'} flex size-[17px] ring-1 ring-gray-50 dark:ring-gray-50 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-violet3`}
				defaultChecked
                checked={checked}
                onCheckedChange={onCheckedChange}
				id="c1"
			>
				<Checkbox.Indicator className="text-white">
					<CheckIcon size={13} width={20}/>
				</Checkbox.Indicator>
			</Checkbox.Root>
		</div>
	</form>
);

export default CheckboxDemo;