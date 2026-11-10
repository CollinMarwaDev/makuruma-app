import { Button } from "~/global/components/button";
import BellIcon from "@heroicons/react/16/solid/BellIcon";
import { CogIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import { ComponentCard } from "~/global/components/component-card";
import Checkbox from "~/global/components/form-controls/checkbox";
import { ComboboxInput } from "~/global/components/form-controls/combobox-input/combobox-input";
import { FieldContainer } from "~/global/components/form-controls/common";
import Label from "~/global/components/form-controls/label";
import { PhoneInput } from "~/global/components/form-controls/phone-input/phone-input";
import { RadioGroup } from "~/global/components/form-controls/radio-group/radio-group";
import { RadioGroupCardItem } from "~/global/components/form-controls/radio-group/radio-group-card";
import { RadioGroupItem } from "~/global/components/form-controls/radio-group/radio-group-item";
import { SelectInput } from "~/global/components/form-controls/select-input";
import NumberInput from "~/global/components/form-controls/text-input-fields/number-input";
import { TextInputBasic } from "~/global/components/form-controls/text-input-fields/text-input-basic";
import { TextInputWithPrefix } from "~/global/components/form-controls/text-input-fields/text-input-with-prefix";
import { TextareaField } from "~/global/components/form-controls/textarea";
import { SearchIcon } from "~/global/components/icons";
import { Switch } from "~/global/components/switch";
import { ComponentPlaygroupGrid } from "~/pages/components-playground/component-playgroup-grid";
import { UserCircle } from "@solar-icons/react/ssr";

export const FormControlsComponents = () => {
    const defaults = {
        contactGroups: [{ label: "Option 2", value: "option3" }],
        savedMedia: [{ label: "Option 1", value: "option1" }],
    };
    const { control, reset, watch } = useForm<FieldValues>({
        defaultValues: defaults,
    });
    const [multiple, setMultiple] = useState(true);

    const comboboxUsers = [
        {
            email: "john.doe@example.com",
            label: "John Doe",
            value: "option1",
        },

        {
            email: "jane.smith@example.com",
            label: "Jane Smith",
            value: "option3",
        },

        {
            avatar: "https://i.pravatar.cc/100",
            email: "bob.johnson@example.com",
            label: `Bob Johnson`,
            value: "option5",
        },
        {
            email: "alice.brown@example.com",
            label: "Alice Brown",
            value: "option9",
        },
        {
            email: "charlie.davis@example.com",
            label: "Charlie Davis",
            value: "option8",
        },
    ];

    return (
        <ComponentCard
            title="Form controls components"
            innerWrapperClassName="space-y-4"
        >
            <ComponentCard title="Input ">
                <ComponentPlaygroupGrid>
                    <div>
                        <TextInputBasic placeholder="Basic text input" />
                    </div>

                    <div>
                        <TextInputBasic
                            type="password"
                            placeholder="Password input"
                        />
                    </div>
                    <FieldContainer>
                        <Label htmlFor="input-1">With Label</Label>
                        <TextInputBasic
                            id="input-1"
                            placeholder="Basic text input"
                        />
                    </FieldContainer>

                    <FieldContainer>
                        <Label htmlFor="input-1">Number Input</Label>
                        <NumberInput
                            suffix={".00"}
                            prefixComponent={"TZS"}
                            inputType={"text-input"}
                            placeholder="Number input"
                            control={control}
                            name="name"
                        />
                    </FieldContainer>

                    <TextInputWithPrefix
                        placeholder="With leading icon"
                        _prefix={SearchIcon}
                    />
                    <TextInputWithPrefix
                        placeholder="With trailing icon"
                        _suffix={UserCircle}
                    />
                </ComponentPlaygroupGrid>
            </ComponentCard>

            <ComponentCard title="Phone Input">
                <ComponentPlaygroupGrid>
                    <div>
                        <PhoneInput />
                    </div>

                    <div>
                        <PhoneInput onChange={console.log} />
                    </div>
                </ComponentPlaygroupGrid>
            </ComponentCard>

            <ComponentCard title="Select Input">
                <ComponentPlaygroupGrid>
                    <div>
                        <SelectInput
                            placeholder="Basic select input"
                            options={[
                                { label: "Option 1", value: "option1" },
                                { label: "Option 2", value: "option2" },
                                { label: "Option 3", value: "option3" },
                            ]}
                        />
                    </div>

                    <div>
                        <SelectInput
                            placeholder="Select with loading"
                            loading={true}
                            options={[
                                { label: "Option 1", value: "option1" },
                                { label: "Option 2", value: "option2" },
                                { label: "Option 3", value: "option3" },
                            ]}
                        />
                    </div>

                    <div>
                        <SelectInput
                            defaultValue={{
                                label: "Option 1",
                                value: "option1",
                            }}
                            placeholder="Select with default value"
                            options={[
                                { label: "Option 1", value: "option1" },
                                { label: "Option 2", value: "option2" },
                                { label: "Option 3", value: "option3" },
                            ]}
                        />
                    </div>

                    <div>
                        <SelectInput
                            placeholder="Select with icons"
                            options={[
                                {
                                    icon: HomeIcon,
                                    label: "Home",
                                    value: "home",
                                },
                                {
                                    icon: BellIcon,
                                    label: "Notifications",
                                    value: "notifications",
                                },
                                {
                                    icon: CogIcon,
                                    label: "Settings",
                                    value: "settings",
                                },
                            ]}
                        />
                    </div>

                    <div>
                        <SelectInput
                            label="With Label"
                            placeholder="Select an option"
                            options={[
                                { label: "Option 1", value: "option1" },
                                { label: "Option 2", value: "option2" },
                                { label: "Option 3", value: "option3" },
                            ]}
                        />
                    </div>

                    <div>
                        <SelectInput
                            label="With Error"
                            placeholder="Select an option"
                            hasError={true}
                            errorMessage="This field is required"
                            options={[
                                { label: "Option 1", value: "option1" },
                                { label: "Option 2", value: "option2" },
                                { label: "Option 3", value: "option3" },
                            ]}
                        />
                    </div>
                </ComponentPlaygroupGrid>
            </ComponentCard>

            <ComponentPlaygroupGrid>
                <Checkbox label={"checkbox"} />
                <TextareaField placeholder="Textarea auto resized" label="" />
            </ComponentPlaygroupGrid>

            <ComponentCard
                title="Switch"
                innerWrapperClassName="flex items-center gap-2"
            >
                <Switch>
                    <Switch.Switcher />
                </Switch>
                <Switch checked>
                    <Switch.Switcher />
                </Switch>
                <Switch checked>
                    <Switch.Switcher offLabel={"Off"} onLabel={"On"} />
                </Switch>

                <Switch>
                    <Switch.Label>Switch with label</Switch.Label>
                    <Switch.Switcher offLabel={"Off"} onLabel={"On"} />
                </Switch>
            </ComponentCard>

            <ComponentCard title="Combobox">
                <div className="flex gap-3">
                    <Button
                        onClick={() => reset(defaults)}
                        type="button"
                        variant="outline"
                    >
                        Restore example selections
                    </Button>
                    <Button
                        onClick={() => setMultiple((previous) => !previous)}
                        type="button"
                        variant="outline"
                    >
                        Change group selection mode
                    </Button>
                </div>
                <output
                    aria-label="Example selections"
                    className="block text-sm"
                >
                    {JSON.stringify(watch(["savedMedia", "contactGroups"]))}
                </output>
                <ComponentPlaygroupGrid>
                    <ComboboxInput
                        label="Saved media example"
                        placeholder="Default combobox"
                        control={control}
                        name="savedMedia"
                        options={[
                            {
                                label: "Option 1",
                                value: "option1",
                            },

                            {
                                label: "Option 2",
                                value: "option3",
                            },
                        ]}
                    />
                    <ComboboxInput
                        placeholder="Default multiselect combobox"
                        control={control}
                        name="contactGroups"
                        label="Contact groups example"
                        multiselect={multiple}
                        options={[
                            {
                                label: "lonjsnjsnjsn Option 1 ",
                                value: "option1",
                            },

                            {
                                label: "Option 2",
                                value: "option3",
                            },
                            {
                                label: "Option 8",
                                value: "option4",
                            },
                            {
                                label: "Option 6",
                                value: "option6",
                            },
                        ]}
                    />

                    <ComboboxInput
                        label="User example"
                        control={control}
                        name="selectedUser"
                        options={comboboxUsers}
                        placeholder="User type"
                        type="user"
                    />

                    <ComboboxInput
                        label="Multiple users example"
                        control={control}
                        name="selectedUsers"
                        multiselect
                        options={comboboxUsers}
                        placeholder="Multselect user type"
                        type="user"
                    />

                    <ComboboxInput
                        label="Empty page example"
                        placeholder="Empty States"
                        emptyMessage="No active queues on this page. Try the next page."
                        footer={
                            <p className="border-outline border-t p-3 text-sm">
                                Optional pagination or page feedback goes here.
                            </p>
                        }
                        control={control}
                        name="emptyExample"
                        options={[]}
                    />
                    <ComboboxInput
                        label="Loading example"
                        placeholder="Loading State"
                        control={control}
                        loading
                        name="loadingExample"
                        options={[]}
                    />
                </ComponentPlaygroupGrid>
            </ComponentCard>

            <ComponentCard title="Radio Group">
                <ComponentPlaygroupGrid>
                    <div>
                        <RadioGroup
                            defaultValue={{
                                label: "Option 1",
                                value: "option1",
                            }}
                        >
                            <RadioGroupItem
                                value={{ label: "Option 1", value: "option1" }}
                            />
                            <RadioGroupItem
                                value={{ label: "Option 2", value: "option2" }}
                            />
                            <RadioGroupItem
                                value={{ label: "Option 3", value: "option3" }}
                            />
                        </RadioGroup>
                    </div>

                    <div>
                        <FieldContainer>
                            <Label>Radio Group with Label</Label>
                            <RadioGroup>
                                <RadioGroupItem
                                    value={{ label: "Small", value: "small" }}
                                />
                                <RadioGroupItem
                                    value={{ label: "Medium", value: "medium" }}
                                />
                                <RadioGroupItem
                                    value={{ label: "Large", value: "large" }}
                                />
                            </RadioGroup>
                        </FieldContainer>
                    </div>

                    <div>
                        <RadioGroup
                            className="flex flex-row gap-4"
                            defaultValue={{ label: "Yes", value: "yes" }}
                        >
                            <RadioGroupItem
                                value={{ label: "Yes", value: "yes" }}
                            />
                            <RadioGroupItem
                                value={{ label: "No", value: "no" }}
                            />
                        </RadioGroup>
                    </div>

                    <div>
                        <RadioGroup>
                            <RadioGroupItem
                                value={{ label: "Enabled", value: "enabled" }}
                            />
                            <RadioGroupItem
                                value={{ label: "Disabled", value: "disabled" }}
                                disabled
                            />
                        </RadioGroup>
                    </div>
                </ComponentPlaygroupGrid>
            </ComponentCard>

            <ComponentCard title="Radio Group Cards">
                <ComponentPlaygroupGrid>
                    <div>
                        <RadioGroup
                            className="space-y-2"
                            defaultValue={{
                                label: "Basic Plan",
                                value: "basic",
                            }}
                        >
                            <RadioGroupCardItem
                                value={{ label: "Basic Plan", value: "basic" }}
                            />
                            <RadioGroupCardItem
                                value={{ label: "Pro Plan", value: "pro" }}
                            />
                            <RadioGroupCardItem
                                value={{
                                    label: "Enterprise",
                                    value: "enterprise",
                                }}
                            />
                        </RadioGroup>
                    </div>
                </ComponentPlaygroupGrid>
            </ComponentCard>
        </ComponentCard>
    );
};
