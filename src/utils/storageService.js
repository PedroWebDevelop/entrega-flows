const StorageService = {
    saveToSession: function(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    },
    getFromSession: function(key) {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    removeFromSession: function(key) {
        sessionStorage.removeItem(key);
    },
    armazenarAnexo: function(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const fileId = 'file_' + new Date().getTime();
                    const fileData = {
                        id: fileId,
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        data: event.target.result
                    };
                    const anexos = StorageService.getFromSession('anexos') || [];
                    anexos.push(fileData);
                    StorageService.saveToSession('anexos', anexos);
                    resolve(fileData);
                } catch (error) {
                    reject('Erro ao armazenar o arquivo: ' + error.message);
                }
            };
            reader.onerror = function() {
                reject('Erro ao ler o arquivo');
            };
            reader.readAsDataURL(file);
        });
    },
    removerAnexo: function(fileId) {
        try {
            const anexos = StorageService.getFromSession('anexos') || [];
            const novaLista = anexos.filter(anexo => anexo.id !== fileId);
            StorageService.saveToSession('anexos', novaLista);
            return true;
        } catch (error) {
            console.error('Erro ao remover anexo:', error);
            return false;
        }
    },
    obterAnexos: function() {
        return StorageService.getFromSession('anexos') || [];
    },
    downloadAnexo: function(fileId) {
        try {
            const anexos = StorageService.getFromSession('anexos') || [];
            const anexo = anexos.find(a => a.id === fileId);
            if (anexo) {
                const link = document.createElement('a');
                link.href = anexo.data;
                link.download = anexo.name;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Erro ao baixar anexo:', error);
        }
    }
};
