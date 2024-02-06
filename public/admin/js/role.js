//permission
const tablePermission = document.querySelector('[permission-table]')
if(tablePermission){
    const buttonSubmit = document.querySelector('[button-submit]');
    buttonSubmit.addEventListener("click",()=>{
        let permissions = [];
        const rows = tablePermission.querySelectorAll("[data-name]");
        rows.forEach(row=>{
            const name = row.getAttribute("data-name");
            const inputs = row.querySelectorAll("input");
            if(name =="id"){
                inputs.forEach(input=>{
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions :[]
                    });
                });
            }
            else{
                inputs.forEach((input,index)=>{
                    const checked = input.checked;
                    if(checked){
                        permissions[index].permissions.push(name);
                    }
                });
            }
        });
        console.log(permissions);
        if(permissions.length > 0){
            const formData = document.querySelector('#form-change-permission');
            const input = formData.querySelector('input[name="permission"]');
            input.value = JSON.stringify(permissions);
            console.log(input.value);
            formData.submit();
        }
        else{
            alert("Chưa chọn quyền");
        }
    });
}
//end permission

//permission defautl
const dataRecords = document.querySelector('[dataRecords]');
if(dataRecords){
    const data=JSON.parse(dataRecords.getAttribute('dataRecords'));
    const tablePermission = document.querySelector('[permission-table]');
    data.forEach((item,index) =>{
        const permissions = item.permissions;
        permissions.forEach(permission =>{
            const row = tablePermission.querySelector(`[data-name="${permission}"]`);
            const input = row.querySelectorAll('input')[index];
            input.checked = true;

        });
    })
}
//end permission default