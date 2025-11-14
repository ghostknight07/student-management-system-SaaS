"use client";

import { useEffect, useState } from "react";
import { FiCalendar, FiSave, FiCheckCircle, FiUser, FiPhone, FiFilter } from "react-icons/fi";

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [batchFilter, setBatchFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [absentStudents, setAbsentStudents] = useState(new Set());
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch students
        const resStudents = await fetch(`/api/students`);
        if (!resStudents.ok) throw new Error('Failed to fetch students');
        const studentData = await resStudents.json();
        
        setStudents(studentData);
        setFilteredStudents(studentData);
        setAbsentStudents(new Set());

        // Fetch batches
        const resBatches = await fetch(`/api/batch/all`);
        if (!resBatches.ok) throw new Error('Failed to fetch batches');
        const batchData = await resBatches.json();
        
        setBatches(batchData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter by batch
  useEffect(() => {
    if (batchFilter) {
      setFilteredStudents(students.filter((s) => s.batch_id === batchFilter));
    } else {
      setFilteredStudents(students);
    }
  }, [batchFilter, students]);

  const toggleAbsent = (studentId) => {
    setAbsentStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const markAllPresent = () => {
    setAbsentStudents(new Set());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          absentStudents: Array.from(absentStudents),
          allPresent: absentStudents.size === 0,
          batchId: batchFilter || null
        }),
      });

      if (!response.ok) throw new Error('Failed to save attendance');
      
      setSubmitSuccess(true);
      setAbsentStudents(new Set());
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBatchName = batches.find(b => b._id?.toString() === batchFilter)?.batch_name || 'All Batches';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-12 w-12 bg-emerald-100 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium text-lg">Loading students...</p>
          <p className="mt-2 text-gray-400 text-sm">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            Student Attendance
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-600">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-emerald-100">
              <FiCalendar className="mr-2 text-emerald-600" />
              <span className="text-sm font-medium">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="bg-emerald-50 text-emerald-700 font-medium px-4 py-2 rounded-full border border-emerald-200 shadow-sm text-sm">
              {selectedBatchName}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100/50 p-6 mb-6 hover:shadow-xl transition-shadow duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <FiCalendar className="mr-1.5 text-emerald-600" />
                Select Date
              </label>
              <div className="relative group">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 group-hover:border-emerald-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center justify-between">
                <span className="flex items-center">
                  <FiFilter className="mr-1.5 text-emerald-600" />
                  Filter by Batch
                </span>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden text-emerald-600 text-xs px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  {showFilters ? 'Hide' : 'Show'}
                </button>
              </label>
              <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
                <select
                  value={batchFilter}
                  onChange={(e) => setBatchFilter(e.target.value)}
                  className="block w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 hover:border-emerald-300 appearance-none bg-white cursor-pointer"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.batch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transform hover:-translate-y-1 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="h-5 w-5" />
                    <span>Save Attendance</span>
                    {absentStudents.size > 0 && (
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">
                        {absentStudents.size}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {submitSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl flex items-center shadow-md">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
              <FiCheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-emerald-800 font-semibold">Success!</p>
              <p className="text-emerald-700 text-sm">
                {absentStudents.size === 0 
                  ? 'All students marked as present' 
                  : 'Attendance has been saved successfully'}
              </p>
            </div>
          </div>
        )}

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="text-gray-300 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4 px-2">
              <p className="text-sm text-gray-600 font-medium">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} total
              </p>
              <div className="flex items-center space-x-2">
                {absentStudents.size > 0 && (
                  <button
                    onClick={markAllPresent}
                    className="text-sm text-emerald-600 font-semibold bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full transition-colors"
                  >
                    Mark All Present
                  </button>
                )}
                <p className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  absentStudents.size === 0 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-50 text-red-600'
                }`}>
                  {absentStudents.size === 0 ? 'All Present' : `${absentStudents.size} Absent`}
                </p>
              </div>
            </div>
            {filteredStudents.map((student, index) => {
              const sId = student._id?.toString();
              const isAbsent = absentStudents.has(sId);
              
              return (
                <div 
                  key={sId} 
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
                    isAbsent ? 'border-red-200 bg-gradient-to-r from-red-50 to-orange-50' : 'border-emerald-100 hover:border-emerald-300'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className={`flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isAbsent ? 'bg-gradient-to-br from-red-100 to-orange-100 text-red-600' : 'bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600'
                        }`}>
                          <FiUser className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-base font-semibold truncate ${
                            isAbsent ? 'text-red-900' : 'text-gray-900'
                          }`}>
                            {student.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FiPhone className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate">{student.phone_number || 'No phone'}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAbsent(sId)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                          isAbsent 
                            ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600'
                        }`}
                      >
                        {isAbsent ? '✓ Present' : '✗ Absent'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}