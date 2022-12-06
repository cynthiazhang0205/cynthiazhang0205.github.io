//
//  reservations.swift
//  tmp
//
//  Created by Jianlgi on 11/28/22.
//

import SwiftUI

struct reservations: View {
    @AppStorage("Reservations") var reservations: String = "";
    var body: some View {
        NavigationView{
            Form{
                Section{
                    if reservations.count > 0 {
                        List{
                            ForEach(parse_reservations(), id: \.self) { i in
                                HStack{
                                    Text(i[1])
                                    Spacer()
                                    Text(i[2].components(separatedBy: ",")[0])
                                    Spacer()
                                    Text(i[3])
                                    Spacer()
                                    Text(i[4])
                                }
                                
                            }.onDelete(perform: delete)
                        }
                    } else {
                        Text("You don't have reservations")
                    }
                }
            }.navigationTitle("Your Reservations")
        }
    }
    
    func parse_reservations() -> [[String]] {
        var ret:[[String]] = []
        for line in reservations.components(separatedBy: "\n"){
            ret.append(line.components(separatedBy: "|"))
        }
        return ret;
    }
    
    func delete(at offsets: IndexSet) {
        var rev:[String] = reservations.components(separatedBy: "\n")
        rev.remove(atOffsets: offsets)
        reservations = rev.joined(separator: "\n")
    }
}

struct reservations_Previews: PreviewProvider {
    static var previews: some View {
        reservations()
    }
}
