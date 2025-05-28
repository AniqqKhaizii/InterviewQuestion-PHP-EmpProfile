import AppearanceToggleTab from '@/components/appearance-tabs';
import React, { useState, useEffect } from 'react';

import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import AnimatedList from '@/components/ui/animated-list';
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

import { Input, Textarea } from '@headlessui/react';
import { Head } from '@inertiajs/react';
import { SelectTrigger } from '@radix-ui/react-select';

type Employee = {
    name: string;
    gender: string;
    maritalStatus: string;
    phone: string;
    email: string;
    address: string;
    dob: string;
    nationality: string;
    hireDate: string;
    department: string;
  };

const EmployeeList = ({ employees }: { employees: Employee[] }) => {
    return (
        <div className='flex flex-col justify-start w-full gap-2'>
            <h2 className="text-2xl font-bold mb-4">Employee List</h2>
            <AnimatedList
                className="w-full"
                items={employees}
                onItemSelect={(item, index) => console.log(item, index)}
                showGradients={false}
                enableArrowNavigation={true}
                displayScrollbar={true}
            />
        </div>
    );
}
export default function Home() {
    const [countryList, setCountryList] = useState<{ cioc: string; name: string }[]>([]);
    const [countryCode, setCountryCode] = useState("+60");
   
    const [formData, setFormData] = useState({
        name: '',
        gender: 'male',
        maritalStatus: '',
        phone: '',
        email: '',
        address: '',
        dob: '',
        nationality: '',
        hireDate: '',
        department: '',
      });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [employees, setEmployees] = useState<Employee[]>([]); 

    const fetchEmployees = () => {
      fetch('/api/employees')
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            setEmployees(data.data);
          }
        })
        .catch((err) => console.error("Failed to load employees:", err));
    };
  
    useEffect(() => {
      fetchEmployees();
    }, []);  
        

    const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name) newErrors.name = "Name is required.";
        if (!formData.gender) newErrors.gender = "Gender is required.";
        if (!formData.maritalStatus) newErrors.maritalStatus = "Marital status is required.";
        if (!formData.phone || !/^\d{7,}$/.test(formData.phone)) newErrors.phone = "Valid phone is required.";
        if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Valid email is required.";
        if (!formData.address) newErrors.address = "Address is required.";
        if (!formData.dob) newErrors.dob = "Date of birth is required.";
        if (!formData.nationality) newErrors.nationality = "Nationality is required.";
        if (!formData.hireDate) newErrors.hireDate = "Hire date is required.";
        if (!formData.department) newErrors.department = "Department is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
      
        const employeeDetail = new FormData();
        for (const [key, value] of Object.entries(formData)) {
        employeeDetail.append(key, value);
        }
        try {
          const res = await fetch('/api/sendDataEmployee', {
            method: 'POST',
            body: employeeDetail,
          });
      
          if (!res.ok) throw new Error('Failed to submit data');
          toast('Form submitted successfully!');
          setFormData({
            name: '',
            gender: 'male',
            maritalStatus: '',
            phone: '',
            email: '',
            address: '',
            dob: '',
            nationality: '',
            hireDate: '',
            department: '',
          })
          fetchEmployees();
        } catch (err) {
          console.error('Submit error:', err);
          alert('Error submitting form.');
        }
    };


    useEffect(() => {
        const fetchCountryList = async () => {
            try {
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cioc');
                const data = await response.json();

                const countries = data
                    .filter((country: any) => country.name?.common && country.cioc)
                    .map((country: any) => ({
                        name: country.name.common,
                        cioc: country.cioc,
                    }))
                    .sort((a: any, b: any) => a.name.localeCompare(b.name));

                setCountryList(countries);
            } catch (error) {
                console.error('Error fetching country list:', error);
            }
        };

        fetchCountryList();
    }, []);


    return (
        <>
            <Head title="Home">
            </Head>
            <div className="flex h-screen flex-col items-center lg:justify-center ">
                <header className="flex items-center w-full justify-between shadow-md lg:p-4 p-2">
                    <h1 className="text-2xl text-foreground">Employee System</h1>
                    <AppearanceToggleTab />
                </header>
                <div className="flex w-full items-start justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0  dark:bg-zinc-900">
                    <Toaster />
                    <main className="flex w-full flex-col-reverse gap-2 lg:flex-row p-4">
                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 lg:w-1/2 self-start starting:translate-y-6 translate-y-0 transition-all duration-600 delay-100 p-4 rounded text-sm">
                            <div className="flex flex-col gap-2 lg:col-span-2">
                                <span className="text-foreground">Full Name</span>
                                <Input 
                                    name="name"
                                    type="text"
                                    placeholder='Full Name'
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={"shadow border border-muted-foreground rounded px-2 h-9 placeholder:text-muted-foreground"}
                                    />
                                {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-foreground">Gender</span>
                                <RadioGroup defaultValue="male" value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" id="male" />
                                        <Label htmlFor="male">Male</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" id="female" />
                                        <Label htmlFor="female">Female</Label>
                                    </div>
                                </RadioGroup>
                                {errors.gender && <span className="text-red-500 text-xs">{errors.gender}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-foreground">Marital Status</span>
                                <Select value={formData.maritalStatus} onValueChange={(val) => handleChange('maritalStatus', val)}>
                                    <SelectTrigger className="shadow border border-muted-foreground rounded px-2 h-9 placeholder:text-muted-foreground text-left">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="single">Single</SelectItem>
                                        <SelectItem value="married">Married</SelectItem>
                                        <SelectItem value="divorced">Divorced</SelectItem>
                                        <SelectItem value="widowed">Widowed</SelectItem>
                                        <SelectItem value="separated">Separated</SelectItem>
                                        <SelectItem value="engaged">Engaged</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.maritalStatus && <span className="text-red-500 text-xs">{errors.maritalStatus}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-foreground">Phone</span>
                                <div className="flex items-center gap-1 w-full">
                                    <Select onValueChange={(value) => setCountryCode(value)} defaultValue="+60">
                                        <SelectTrigger className="shadow border border-muted-foreground rounded px-4 h-9">
                                        {countryCode}
                                        </SelectTrigger>
                                        <SelectContent>
                                        <SelectItem value="+60">Malaysia (+60)</SelectItem>
                                        <SelectItem value="+65">Singapore (+65)</SelectItem>
                                        <SelectItem value="+62">Indonesia (+62)</SelectItem>
                                        <SelectItem value="+66">Thailand (+66)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        name="phone"
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={formData.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="123456789"
                                        required
                                        className="no-spinner appearance-none w-full shadow border border-muted-foreground rounded px-2 h-9 placeholder:text-muted-foreground"
                                    />
                                    {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-foreground">Email</span>
                                <Input 
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    placeholder="LHn8M@example.com"
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={"shadow border border-muted-foreground rounded px-2 h-9 placeholder:text-muted-foreground"}
                                    />
                                {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                            </div>
                            <div className="flex flex-col gap-2 lg:col-span-2">
                                <span className="text-foreground">Address</span>
                                <Textarea 
                                    name="address"
                                    placeholder="4078, Jalan Harapan 2, Taman Harapan, 14300 Nibong Tebal, Pulau Pinang"
                                    value={formData.address}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    rows={3}
                                    className={"shadow border border-muted-foreground rounded px-2 placeholder:text-muted-foreground"}
                                    ></Textarea>
                                {errors.address && <span className="text-red-500 text-xs">{errors.address}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-foreground">Date of Birth</span>
                                <Input 
                                    name="dob"
                                    type="date"
                                    onChange={(e) => handleChange('dob', e.target.value)}
                                    className={"shadow border border-muted-foreground rounded px-2 h-9 placeholder:text-muted-foreground"}
                                    />
                                {errors.dob && <span className="text-red-500 text-xs">{errors.dob}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-foreground">Nationality</span>
                                <Select value={formData.nationality} onValueChange={(val) => handleChange('nationality', val)}>
                                    <SelectTrigger className="shadow border border-muted-foreground rounded px-2 h-9 placeholder:text-muted-foreground text-left">
                                        <SelectValue placeholder="Nationality" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countryList.map((country) => (
                                            <SelectItem key={country.name} value={country.name}>
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.nationality && <span className="text-red-500 text-xs">{errors.nationality}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-foreground">Hire Date</span>
                                <Input 
                                    name="hireDate"
                                    type="date"
                                    value={formData.hireDate}
                                    onChange={(e) => handleChange('hireDate', e.target.value)}
                                    className={"shadow border border-muted-foreground rounded px-2 h-9 placeholder:text-muted-foreground"}
                                    />
                                {errors.hireDate && <span className="text-red-500 text-xs">{errors.hireDate}</span>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-foreground">Department</span>
                                <Input 
                                    name="department"
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => handleChange('department', e.target.value)}
                                    placeholder='Department'
                                    className={"shadow border border-muted-foreground rounded px-2 h-9 placeholder:text-muted-foreground"}
                                    />
                                {errors.department && <span className="text-red-500 text-xs">{errors.department}</span>}
                            </div>

                            <Button onClick={handleSubmit} className="mt-4 w-1/3 justify-self-end lg:col-span-3">
                                Submit
                            </Button>
                        </div>
                        <div className="flex flex-col items-center justify-start lg:w-1/2 starting:translate-y-6 translate-y-0 transition-all duration-600 delay-100 p-4 rounded">
                            <EmployeeList employees={employees} />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
