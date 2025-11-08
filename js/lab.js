const lab = {
    async loadDashboard() {
        await this.loadAssignedTests();
    },

    async loadAssignedTests() {
        const result = await auth.apiRequest('/lab/assignments');
        const tbody = document.getElementById('assignedTestsTableBody');
        
        if (result.success && result.data.length > 0) {
            tbody.innerHTML = result.data.map(test => `
                <tr>
                    <td>${test.patientId}</td>
                    <td>${test.testName}</td>
                    <td>${new Date(test.assignedDate).toLocaleDateString()}</td>
                    <td>
                        <span class="badge ${test.status === 'completed' ? 'badge-completed' : 'badge-pending'}">
                            ${test.status}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="lab.fillUploadForm('${test.patientId}', '${test.testName}', '${test.id}')">
                            Upload Report
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No assigned tests</td></tr>';
        }
    },

    fillUploadForm(patientId, testName, testId) {
        document.getElementById('reportPatientId').value = patientId;
        document.getElementById('reportTestName').value = testName;
        // Store testId for later use
        document.getElementById('uploadReportForm').dataset.testId = testId;
    },

    init() {
        document.getElementById('uploadReportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.uploadReport();
        });
    },

    async uploadReport() {
        const patientId = document.getElementById('reportPatientId').value.trim();
        const testName = document.getElementById('reportTestName').value.trim();
        const testId = document.getElementById('uploadReportForm').dataset.testId;
        const fileInput = document.getElementById('reportFile');
        
        if (!fileInput.files[0]) {
            this.showAlert('danger', 'Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('patientId', patientId);
        formData.append('testName', testName);
        formData.append('report', fileInput.files[0]);
        if (testId) {
            formData.append('testId', testId);
        }

        const token = auth.getToken();
        const API_BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';
        const alertContainer = document.getElementById('uploadReportAlert');
        
        try {
            const response = await fetch(`${API_BASE_URL}/lab/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                this.showAlert('success', 'Report uploaded successfully!');
                document.getElementById('uploadReportForm').reset();
                delete document.getElementById('uploadReportForm').dataset.testId;
                await this.loadAssignedTests();
            } else {
                this.showAlert('danger', data.error || 'Failed to upload report');
            }
        } catch (error) {
            console.error('Upload error:', error);
            this.showAlert('danger', 'Network error. Please try again.');
        }
    },

    showAlert(type, message) {
        const alertContainer = document.getElementById('uploadReportAlert');
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
};

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => lab.init());
} else {
    lab.init();
}

