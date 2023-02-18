import { Component, OnInit } from '@angular/core';
import { userTableColumns } from './data';
import { TableColumn, ColumnType } from 'src/app/models/common-table-models/CommonTableModel';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
  providers: []

})
export class UserSummaryComponent implements OnInit {

  userList: any = [];
  usersTableColumns!: TableColumn[];
  userTableData: any[] = [];
  isLoading = true;

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.usersTableColumns = userTableColumns;
    this.userService.getUsers().subscribe((data: {}) => {
      this.userList = data;
      console.log(data)
      this.buildUserTable();
      this.isLoading = false;
    });
  }

  buildUserTable() {
    this.userList.forEach((user: any) => {
      const userTableItem = [
        {
          'col_id': 'action',
          'cell_val': user.id,
          'type': ColumnType.Action,
          'searchable': false
        },
        {
          'col_id': 'firstName',
          'cell_val': user.firstName,
          'type': ColumnType.String,
          'searchable': true
        },
        {
          'col_id': 'lastName',
          'cell_val': user.lastName,
          'type': ColumnType.String,
          'searchable': true
        },
        {
          'col_id': 'email',
          'cell_val': user.email,
          'type': ColumnType.String,
          'searchable': true
        },
        {
          'col_id': 'phoneNumber',
          'cell_val': user.phoneNumber,
          'type': ColumnType.String,
          'searchable': true
        },
        {
          'col_id': 'designation',
          'cell_val': user.designation,
          'type': ColumnType.String,
          'searchable': true
        }
      ]
      this.userTableData.push(userTableItem);
    });
  }

}

