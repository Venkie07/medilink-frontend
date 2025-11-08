const patient = {
    patientId: null,
    patientData: null,

    async loadDashboard() {
        const user = auth.getUser();
        
        // Get patient's own profile
        const result = await auth.apiRequest('/patients/me/profile');
        
        if (result.success) {
            this.patientData = result.data;
            this.patientId = result.data.patientId;
            
            // Display patient info
            document.getElementById('patientInfo').innerHTML = `
                <div class="patient-card">
                    <h5>${this.patientData.name}</h5>
                    <p><strong>Patient ID:</strong> ${this.patientData.patientId}</p>
                    <p><strong>Age:</strong> ${this.patientData.age} years</p>
                    <p><strong>Gender:</strong> ${this.patientData.gender}</p>
                    <p><strong>Contact:</strong> ${this.patientData.contact}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                </div>
            `;
            
            // Load reports and prescriptions
            await this.loadReports(this.patientId);
            await this.loadPrescriptions(this.patientId);
        } else {
            document.getElementById('patientInfo').innerHTML = `
                <div class="alert alert-warning">
                    <p>${result.error || 'Patient profile not found. Please contact your doctor.'}</p>
                </div>
            `;
        }
    },

    async loadReports(patientId) {
        if (!patientId) {
            document.getElementById('reportsContainer').innerHTML = '<p class="text-center text-muted">Please provide a Patient ID</p>';
            return;
        }

        const result = await auth.apiRequest(`/lab/reports/${patientId}`);
        const container = document.getElementById('reportsContainer');
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(report => `
                <div class="report-item">
                    <h6>${report.testName}</h6>
                    <p class="mb-1"><strong>Uploaded:</strong> ${new Date(report.uploadDate).toLocaleString()}</p>
                    <a href="${report.fileUrl}" target="_blank" class="btn btn-sm btn-primary">View Report</a>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-center text-muted">No reports found</p>';
        }
    },

    async loadPrescriptions(patientId) {
        if (!patientId) {
            document.getElementById('prescriptionsContainer').innerHTML = '<p class="text-center text-muted">Please provide a Patient ID</p>';
            return;
        }

        const result = await auth.apiRequest(`/prescriptions/${patientId}`);
        const container = document.getElementById('prescriptionsContainer');
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(prescription => `
                <div class="prescription-card">
                    <div class="prescription-header">
                        <h5>Prescription</h5>
                        <small class="text-muted">Date: ${new Date(prescription.date).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <strong>Medicines:</strong>
                        <ul>
                            ${prescription.medicinesWithStatus.map(med => `
                                <li>
                                    ${med.name} 
                                    <span class="badge ${med.status === 'issued' ? 'badge-issued' : 'badge-pending'}">
                                        ${med.status}
                                    </span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-center text-muted">No prescriptions found</p>';
        }
    },

    async downloadIdCard(patientId = null) {
        // Use 'me' if patientId is not provided and we have patient data
        const idToUse = patientId || (this.patientId ? this.patientId : 'me');
        
        try {
            const token = auth.getToken();
            const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_BASE_URL}/patients/id-card/${idToUse}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ID_${patientId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to download ID card');
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download ID card');
        }
    }
};

