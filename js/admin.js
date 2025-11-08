const admin = {
    async loadDashboard() {
        await this.loadStats();
        await this.loadUsers();
        await this.loadPatients();
        await this.loadReports();
        await this.loadPrescriptions();
    },

    async loadStats() {
        const result = await auth.apiRequest('/admin/stats');
        if (result.success) {
            document.getElementById('totalUsers').textContent = result.data.totalUsers;
            document.getElementById('totalPatients').textContent = result.data.totalPatients;
            document.getElementById('totalReports').textContent = result.data.totalReports;
            document.getElementById('totalPrescriptions').textContent = result.data.totalPrescriptions;
        }
    },

    async loadUsers() {
        const result = await auth.apiRequest('/admin/users');
        const tbody = document.getElementById('usersTableBody');
        
        if (result.success && result.data.length > 0) {
            tbody.innerHTML = result.data.map(user => `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="badge bg-primary">${user.role}</span></td>
                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="admin.deleteUser('${user.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
        }
    },

    async deleteUser(userId) {
        if (!confirm('Are you sure you want to delete this user?')) return;

        const result = await auth.apiRequest(`/admin/user/${userId}`, { method: 'DELETE' });
        if (result.success) {
            alert('User deleted successfully');
            this.loadUsers();
            this.loadStats();
        } else {
            alert(result.error || 'Failed to delete user');
        }
    },

    async loadPatients() {
        const result = await auth.apiRequest('/admin/patients');
        const tbody = document.getElementById('patientsTableBody');
        
        if (result.success && result.data.length > 0) {
            tbody.innerHTML = result.data.map(patient => `
                <tr>
                    <td>${patient.patientId}</td>
                    <td>${patient.name}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender}</td>
                    <td>${patient.contact}</td>
                    <td>${new Date(patient.created_at).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No patients found</td></tr>';
        }
    },

    async loadReports() {
        const result = await auth.apiRequest('/admin/reports');
        const container = document.getElementById('reportsContainer');
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(report => `
                <div class="report-item">
                    <h6>${report.testName}</h6>
                    <p class="mb-1"><strong>Patient ID:</strong> ${report.patientId}</p>
                    <p class="mb-1"><strong>Uploaded:</strong> ${new Date(report.uploadDate).toLocaleString()}</p>
                    <a href="${report.fileUrl}" target="_blank" class="btn btn-sm btn-primary">View Report</a>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-center">No reports found</p>';
        }
    },

    async loadPrescriptions() {
        const result = await auth.apiRequest('/admin/prescriptions');
        const container = document.getElementById('prescriptionsContainer');
        
        if (result.success && result.data.length > 0) {
            container.innerHTML = result.data.map(prescription => `
                <div class="prescription-card">
                    <div class="prescription-header">
                        <h5>Patient: ${prescription.patientId}</h5>
                        <small class="text-muted">Date: ${new Date(prescription.date).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <strong>Medicines:</strong>
                        <ul>
                            ${prescription.medicines.map(med => `<li>${typeof med === 'string' ? med : med.name || med}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="text-center">No prescriptions found</p>';
        }
    }
};

