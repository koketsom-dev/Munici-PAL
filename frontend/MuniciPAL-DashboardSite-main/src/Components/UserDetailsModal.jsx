import { useState } from "react";
import {Mail, Phone, BadgeCheck, User, Briefcase} from "lucide-react";

export default function UserDetailsModal({employee,  onClose }) {
    if(!employee) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
            <div className="bg-white rounded-lg p-6 w-[850px] max-h-[80vh] overflow-y-auto shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-500"/>
                        Employee Details
                    </h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">✕</button>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4 text-blue-500"/>
                        <span className="font-medium text-gray-600 w-28">Employee ID:</span>
                        <span>{employee.empID}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-500"/>
                        <span className="font-medium text-gray-600 w-28">Name:</span>
                        <span>{employee.name} {employee.surname}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500"/>
                        <span className="font-medium text-gray-600 w-28">Email:</span>
                        <span>{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-500"/>
                        <span className="font-medium text-gray-600 w-28">Phone:</span>
                        <span>{employee.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-500"/>
                        <span className="font-medium text-gray-600 w-28">Job Title:</span>
                        <span>{employee.jobTitle}</span>
                    </div>    
                </div>
            </div>
        </div>
    );
}