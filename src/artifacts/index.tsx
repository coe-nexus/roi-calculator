import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Users, Info } from 'lucide-react';

const CRFPCalculator = () => {
  const [hygienists, setHygienists] = useState(2);
  const [patientsPerHygienist, setPatientsPerHygienist] = useState(8);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [curodontPatients, setCurodontPatients] = useState(50);
  const [pricePerTreatment, setPricePerTreatment] = useState(120);
  const [qualificationRate, setQualificationRate] = useState(75); // Default 75%

  const priceOptions = [
    { value: 75, label: "$75 per treatment" },
    { value: 120, label: "$120 per treatment (Average)" },
    { value: 150, label: "$150 per treatment" }
  ];
  
  const calculateMetrics = () => {
    // Calculate total potential patients
    const workingWeeks = 50; // Assuming 2 weeks vacation
    const totalPatientsPerYear = hygienists * patientsPerHygienist * daysPerWeek * workingWeeks;
    
    // Calculate current treated patients annually
    const treatedPatientsPerYear = curodontPatients * 12;

    // Calculate total qualified patients based on slider percentage
    const totalQualifiedPatients = Math.round(totalPatientsPerYear * (qualificationRate / 100));
    
    // Current revenue from treatments
    const curodontRevenue = treatedPatientsPerYear * pricePerTreatment;
    
    // Calculate missed opportunity based on percentage of qualified patients
    const missedPatients = totalQualifiedPatients - treatedPatientsPerYear;
    const missedRevenue = Math.max(0, missedPatients * pricePerTreatment);
    
    // Monthly calculations
    const monthlyPotential = totalQualifiedPatients / 12;
    const monthlyCurrent = curodontPatients;
    
    return {
      totalPatientsPerYear,
      qualifiedPatients: totalQualifiedPatients,
      curodontRevenue,
      missedRevenue,
      missedPatients,
      monthlyPotential,
      monthlyCurrent
    };
  };

  const metrics = calculateMetrics();
  
  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    name: `Month ${i + 1}`,
    potential: Math.round(metrics.monthlyPotential),
    current: Math.round(metrics.monthlyCurrent)
  }));

  const opportunityData = [
    {
      name: 'Current Annual Revenue',
      value: metrics.curodontRevenue,
    },
    {
      name: 'Missed Opportunity',
      value: metrics.missedRevenue,
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">CRFP ROI Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <Alert className="bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                The average price per CRFP treatment is $120. Adjust the price based on your practice's pricing strategy.
              </AlertDescription>
            </Alert>
            <Alert className="bg-green-50">
              <Info className="h-4 w-4" />
              <AlertDescription>
                CRFP can be applied on early caries lesions (E1, E2) and "watch areas". These present significant treatment opportunities for preventive care.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Hygienists
                </label>
                <input
                  type="number"
                  value={hygienists}
                  onChange={(e) => setHygienists(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Patients per Hygienist per Day
                </label>
                <input
                  type="number"
                  value={patientsPerHygienist}
                  onChange={(e) => setPatientsPerHygienist(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Working Days per Week
                </label>
                <input
                  type="number"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                  min="0"
                  max="7"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Monthly CRFP Treatments
                </label>
                <input
                  type="number"
                  value={curodontPatients}
                  onChange={(e) => setCurodontPatients(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Patient Qualification Rate (%)
                </label>
                <input
                  type="range"
                  value={qualificationRate}
                  onChange={(e) => setQualificationRate(parseInt(e.target.value))}
                  className="w-full"
                  min="40"
                  max="85"
                  step="1"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>40%</span>
                  <span>{qualificationRate}%</span>
                  <span>85%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price per Treatment
                </label>
                <select
                  value={pricePerTreatment}
                  onChange={(e) => setPricePerTreatment(parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  {priceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Annual CRFP Qualified Patients</p>
                      <p className="text-2xl font-bold">{metrics.qualifiedPatients.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">({qualificationRate}% of {metrics.totalPatientsPerYear.toLocaleString()} total)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Annual Revenue</p>
                      <p className="text-2xl font-bold">${metrics.curodontRevenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Based on {curodontPatients} monthly treatments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <TrendingUp className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Missed Annual Revenue</p>
                      <p className="text-2xl font-bold">${metrics.missedRevenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{metrics.missedPatients.toLocaleString()} untreated qualified patients</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Patient Potential vs Current</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="potential" stroke="#2196F3" name="Qualified Patients" />
                      <Line type="monotone" dataKey="current" stroke="#4CAF50" name="Current CRFP Patients" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Opportunity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={opportunityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Bar dataKey="value" fill="#2196F3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CRFPCalculator;