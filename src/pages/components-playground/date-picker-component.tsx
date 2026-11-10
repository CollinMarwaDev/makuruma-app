import { ComponentCard } from "~/global/components/component-card";
import { DatePicker } from "~/global/components/date-picker";
import { DateRange } from "~/global/components/date-range";

export const DatePickerComponent = () => {
    return (
        <ComponentCard title="Date Picker">
            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Default Date Picker
                    </label>
                    <DatePicker
                        onChange={(date) => {
                            console.log("Selected date:", date);
                        }}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        With Default Value
                    </label>
                    <DatePicker
                        defaultValue="2024-01-15"
                        onChange={(date) => {
                            console.log("Selected date:", date);
                        }}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        With Error State
                    </label>
                    <DatePicker
                        hasError={true}
                        onChange={(date) => {
                            console.log("Selected date:", date);
                        }}
                    />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        With Range
                    </label>
                    <DateRange
                        onChange={(date) => {
                            console.log("Selected date:", date);
                        }}
                    />
                </div>
            </div>
        </ComponentCard>
    );
};
