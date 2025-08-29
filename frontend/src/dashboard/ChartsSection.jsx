import React from "react";
import { Card } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

const COULEURS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartsSection = ({ divisionData = [], serviceData = [], darkMode = false }) => {
  return (
    <div className="row mb-4">
      {/* Répartition par division */}
      <div className="col-lg-6 mb-3">
        <Card className="h-100 shadow" style={{
          backgroundColor: darkMode ? '#2c2c2c' : '#fff',
          border: darkMode ? '1px solid #444' : '1px solid #dee2e6'
        }}>
          <Card.Body>
            <h5 style={{ color: darkMode ? '#fff' : '#000' }}>Répartition par Division</h5>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={divisionData || []} dataKey="value" nameKey="name" outerRadius={80} label>
                  {(divisionData || []).map((entry, index) => (
                    <Cell key={index} fill={COULEURS[index % COULEURS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </div>

      {/* Répartition par service */}
      <div className="col-lg-6 mb-3">
        <Card className="h-100 shadow" style={{
          backgroundColor: darkMode ? '#2c2c2c' : '#fff',
          border: darkMode ? '1px solid #444' : '1px solid #dee2e6'
        }}>
          <Card.Body>
            <h5 style={{ color: darkMode ? '#fff' : '#000' }}>Répartition par Service</h5>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={serviceData || []}>
                <XAxis dataKey="name" stroke={darkMode ? "#fff" : "#000"} />
                <YAxis stroke={darkMode ? "#fff" : "#000"} />
                <Tooltip contentStyle={{
                  backgroundColor: darkMode ? '#2c2c2c' : '#fff',
                  border: darkMode ? '1px solid #444' : '1px solid #ccc',
                  color: darkMode ? '#fff' : '#000'
                }} />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ChartsSection;
