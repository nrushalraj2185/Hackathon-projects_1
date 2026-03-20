import { useState } from 'react';
import { useGetFarmSummary, useGetFarmExpenses, useGetFarmIncome } from '@workspace/api-client-react';
import { Wallet, TrendingUp, TrendingDown, Package, Link2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function Farm() {
  const [activeTab, setActiveTab] = useState<'expenses'|'income'|'inventory'|'livestock'>('expenses');
  
  const { data: summary } = useGetFarmSummary();
  const { data: expenses } = useGetFarmExpenses();
  const { data: incomes } = useGetFarmIncome();

  const expenseData = [
    { name: 'Seeds', value: 40000 },
    { name: 'Fertilizers', value: 30000 },
    { name: 'Labor', value: 20000 },
    { name: 'Equipment', value: 15000 },
  ];
  const COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold">Farm Management</h1>
        <p className="text-muted-foreground">Track financials, inventory, and livestock</p>
      </div>

      {/* Top Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <TrendingUp className="w-5 h-5" /> 
            <span className="font-medium">Total Income</span>
          </div>
          <div className="text-4xl font-bold tracking-tight">₹{(summary?.totalIncome || 450000).toLocaleString()}</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2 opacity-80">
            <TrendingDown className="w-5 h-5" /> 
            <span className="font-medium">Total Expenses</span>
          </div>
          <div className="text-4xl font-bold tracking-tight">₹{(summary?.totalExpenses || 120000).toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2 opacity-80">
              <Wallet className="w-5 h-5" /> 
              <span className="font-medium">Net Profit</span>
            </div>
            <div className="text-4xl font-bold tracking-tight">₹{((summary?.totalIncome || 450000) - (summary?.totalExpenses || 120000)).toLocaleString()}</div>
          </div>
          <div className="w-24 h-24">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{name:'Profit', value: 73}, {name:'Cost', value: 27}]} cx="50%" cy="50%" innerRadius={25} outerRadius={40} dataKey="value" stroke="none">
                    <Cell fill="#ffffff" />
                    <Cell fill="rgba(255,255,255,0.3)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl shadow-sm border border-border/50 overflow-hidden">
        <div className="flex border-b overflow-x-auto no-scrollbar">
          {(['expenses', 'income', 'inventory', 'livestock'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold text-sm capitalize whitespace-nowrap transition-colors relative ${
                activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold capitalize">{activeTab} Details</h2>
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm hover:shadow flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>

          {activeTab === 'expenses' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Date</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-right rounded-r-lg">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(expenses || [{id:1, date:'2024-03-01', category:'Seeds', description:'Wheat seeds var A', amount: 15000}]).map(exp => (
                      <tr key={exp.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-4 font-medium">{format(new Date(exp.date), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-4">
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold">{exp.category}</span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground">{exp.description}</td>
                        <td className="px-4 py-4 text-right font-bold text-red-600">-₹{exp.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-muted/20 rounded-2xl p-6 border border-border/50">
                <h3 className="font-bold mb-4">Expenses by Category</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={expenseData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {expenseData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length]}}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-semibold">₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'income' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Date</th>
                    <th className="px-4 py-3">Source</th>
                    <th className="px-4 py-3">Buyer/Market</th>
                    <th className="px-4 py-3 text-right rounded-r-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(incomes || [{id:1, date:'2024-03-15', source:'Crop Sale', buyer:'Mandi', amount: 85000}]).map(inc => (
                    <tr key={inc.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-4 font-medium">{format(new Date(inc.date), 'MMM dd, yyyy')}</td>
                      <td className="px-4 py-4">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">{inc.source}</span>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{inc.buyer || '-'}</td>
                      <td className="px-4 py-4 text-right font-bold text-green-600">+₹{inc.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {(activeTab === 'inventory' || activeTab === 'livestock') && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Module coming soon. Track your physical assets and animals here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
