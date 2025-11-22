import type { CardType } from "@/types/board/card"
import CheckboxDemo from "./ui/checkbox"
import { useState } from "react"

type CardDetailProps = {
    data: CardType
}

export const CardDetail = ({data}:CardDetailProps) => {
    console.log(data)
    const [checked, setChecked] = useState<boolean | undefined>(data.status)
    return (
        <div className="w-full h-full">
            
            {/* cover */}
            <div className={`bg-cover w-full border-b-1 ${data.cover ? 'h-50' : 'h-15'}`} style={{backgroundImage:`"url(${data.cover})"`}}>
                
            </div>
            {/* Content */}
            <div className="w-full">
                <div className="flex items-center gap-2">
                    <CheckboxDemo onCheckedChange={(checked) => setChecked(checked === true)} checked={checked}/>
                    <label>{data.label}</label>
                </div>

            </div>
        </div>
    )
}